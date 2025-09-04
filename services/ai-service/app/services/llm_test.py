import json
import re
from typing import Dict, Any, List
import logging
from app.config import settings
from app.utils.text_cleaner import squash_whitespace

logger = logging.getLogger(__name__)

class _OpenAIGenerator:
    def __init__(self, api_key: str):
        try:
            from openai import OpenAI
        except ImportError as e:
            raise RuntimeError("OpenAI mode requested but 'openai' is not installed. Run `pip install openai`.") from e
        self.client = OpenAI(api_key=api_key)

    def generate(self, prompt: str, style: str | None, complexity: str | None, services: tuple = ()) -> Dict[str, Any]:
        services = list(services) if services else None
        system_msg = (
            "You are a senior software architect. Return ONLY a valid JSON object with keys: services, databases, apis, diagrams, notes, provided_services. "
            f"Generate a system design for the requirement: '{prompt}'. "
            f"Architecture style: {style or 'microservices'}. Complexity: {complexity or 'basic'}. "
            "Follow this schema:\n"
            "{\n"
            "  \"services\": [{\"name\": \"\", \"responsibilities\": [\"\"], \"techSuggestions\": [\"\"], \"events\": [\"\"]}],\n"
            "  \"databases\": [{\"name\": \"\", \"type\": \"postgres|mongo|dynamo\", \"schemaDDL\": \"\"}],\n"
            "  \"apis\": [{\"service\": \"\", \"path\": \"\", \"method\": \"GET|POST|PUT|DELETE\", \"requestSchema\": {}, \"responseSchema\": {}}],\n"
            "  \"diagrams\": [{\"type\": \"mermaid\", \"content\": \"\"}],\n"
            "  \"notes\": \"\",\n"
            "  \"provided_services\": []\n"
            "}\n"
            f"Include these services in the design and diagram: {', '.join(services) if services else 'none'}. "
            "Generate a Mermaid flowchart (type 'flowchart LR') in the 'diagrams' field."
        )
        user_msg = prompt

        resp = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.3,
        )
        text = resp.choices[0].message.content
        try:
            data = json.loads(text)
            data["provided_services"] = services or []
            return data
        except Exception:
            logger.error(f"Failed to parse OpenAI response: {text}")
            return _TemplateGenerator().generate(prompt, style, complexity, services)

class _TemplateGenerator:
    @staticmethod
    def guess_domain(prompt: str) -> str:
        p = prompt.lower()
        if any(kw in p for kw in ["e-commerce", "ecommerce", "cart", "shop"]):
            return "ecommerce"
        if any(kw in p for kw in ["ride", "taxi", "driver"]):
            return "ridesharing"
        if any(kw in p for kw in ["food", "delivery"]):
            return "food-delivery"
        if any(kw in p for kw in ["chat", "messag"]):
            return "chat"
        return "generic"

    def generate(self, prompt: str, style: str | None, complexity: str | None, services: tuple = ()) -> Dict[str, Any]:
        services = list(services) if services else None
        domain = self.guess_domain(prompt)
        style = (style or "microservices").lower()
        complexity = (complexity or "basic").lower()

        # Base services
        default_services = [
            {"name": "api-gateway", "responsibilities": ["Routing requests", "Rate limiting", "Authentication forwarding"],
             "techSuggestions": ["Spring Cloud Gateway", "Nginx"], "events": []},
            {"name": "auth-service", "responsibilities": ["User authentication", "Token issuance", "Role-based access"],
             "techSuggestions": ["Spring Boot", "PostgreSQL"], "events": ["USER_CREATED"]},
        ]

        # Incorporate provided services
        provided_services = services or []
        for svc in provided_services:
            if not any(s["name"] == svc for s in default_services):
                default_services.append({
                    "name": svc,
                    "responsibilities": [f"Core {svc} functionality"],
                    "techSuggestions": ["Spring Boot" if style == "monolith" else "Node.js", "PostgreSQL"],
                    "events": [f"{svc.upper()}_PROCESSED"]
                })

        # Domain-specific services based on prompt
        if domain == "ecommerce":
            default_services += [
                {"name": "catalog-service", "responsibilities": ["Manage products", "Search and categories"],
                 "techSuggestions": ["Elasticsearch", "PostgreSQL"], "events": ["PRODUCT_CREATED"]},
                {"name": "order-service", "responsibilities": ["Order processing", "Payment orchestration"],
                 "techSuggestions": ["Kafka", "PostgreSQL"], "events": ["ORDER_PLACED", "ORDER_PAID"]},
                {"name": "payment-service", "responsibilities": ["Payment processing", "Refunds"],
                 "techSuggestions": ["Stripe", "PayPal"], "events": ["PAYMENT_SUCCEEDED"]}
            ]
        elif domain == "ridesharing":
            default_services += [
                {"name": "rider-service", "responsibilities": ["Rider profiles", "Ride history"],
                 "techSuggestions": ["PostgreSQL"], "events": ["RIDER_REGISTERED"]},
                {"name": "driver-service", "responsibilities": ["Driver management", "Availability tracking"],
                 "techSuggestions": ["PostgreSQL"], "events": ["DRIVER_APPROVED"]},
                {"name": "trip-service", "responsibilities": ["Trip management", "Billing"],
                 "techSuggestions": ["Kafka", "PostgreSQL"], "events": ["TRIP_CREATED"]}
            ]
        elif domain == "food-delivery":
            default_services += [
                {"name": "restaurant-service", "responsibilities": ["Menu management", "Restaurant availability"],
                 "techSuggestions": ["PostgreSQL"], "events": ["RESTAURANT_ADDED"]},
                {"name": "order-service", "responsibilities": ["Order placement", "Tracking"],
                 "techSuggestions": ["Kafka", "PostgreSQL"], "events": ["ORDER_PLACED"]},
                {"name": "delivery-service", "responsibilities": ["Courier assignment", "Delivery tracking"],
                 "techSuggestions": ["Redis", "Kafka"], "events": ["DELIVERY_ASSIGNED"]}
            ]
        elif domain == "chat":
            default_services += [
                {"name": "user-profile-service", "responsibilities": ["User profiles", "Contacts"],
                 "techSuggestions": ["PostgreSQL"], "events": ["USER_UPDATED"]},
                {"name": "message-service", "responsibilities": ["Message sending/receiving", "Storage"],
                 "techSuggestions": ["Kafka", "MongoDB"], "events": ["MESSAGE_SENT"]}
            ]

        # Filter services based on provided services and complexity
        if provided_services:
            default_services = [svc for svc in default_services if svc["name"] in provided_services]
        elif complexity == "basic":
            default_services = default_services[:2]  # Limit to api-gateway and auth-service for basic

        # Adjust tech stack based on style
        for svc in default_services:
            if style == "monolith":
                svc["techSuggestions"] = ["Spring Boot", "MySQL"]
            elif style == "serverless":
                svc["techSuggestions"] = ["AWS Lambda", "DynamoDB"]
            elif style == "event-driven":
                svc["techSuggestions"] = ["Kafka", "Redis"]

        # Databases based on style and complexity
        db_type = "postgres" if style in ["microservices", "monolith"] else "dynamo" if style == "serverless" else "mongo"
        databases = [
            {"name": "app-db", "type": db_type,
             "schemaDDL": "CREATE TABLE users(id SERIAL PRIMARY KEY, email TEXT UNIQUE, name TEXT);" if db_type == "postgres" else "{}"}
        ]
        if complexity == "advanced":
            databases.append({
                "name": "analytics-db", "type": "mongo",
                "schemaDDL": "{}"
            })

        # APIs tailored to services
        apis = []
        for svc in default_services:
            svc_name = svc["name"]
            apis.append({
                "service": svc_name,
                "path": f"/api/v1/{svc_name.replace('-service', '')}",
                "method": "POST",
                "requestSchema": {"id": "string"},
                "responseSchema": {"status": "string"}
            })

        # Generate a simple Mermaid flowchart
        diagram_content = "flowchart LR\n"
        diagram_content += "  U[User] --> F[Frontend]\n  F --> G[API Gateway]\n"
        for i, svc in enumerate(default_services, 1):
            svc_id = f"S{i}"
            diagram_content += f"  {svc_id}[{svc['name']}]\n  G --> {svc_id}\n"
        if databases:
            diagram_content += "  D[(Database)]\n"
            if default_services:
                diagram_content += f"  S{len(default_services)} --> D\n"

        notes = f"Generated design for prompt: '{prompt[:120]}...'. Style: {style}, Complexity: {complexity}, Services: {provided_services or 'none'}."
        return {
            "services": default_services,
            "databases": databases,
            "apis": apis,
            "diagrams": [{"type": "mermaid", "content": diagram_content}],
            "notes": notes,
            "provided_services": provided_services
        }

class _HFGenerator:
    def __init__(self, model_name: str, use_gpu: bool):
        try:
            from transformers import pipeline, AutoTokenizer, BitsAndBytesConfig
        except Exception as e:
            raise RuntimeError(
                "HuggingFace mode requested but 'transformers' is not installed. "
                "Install transformers/torch or use MODEL_BACKEND=template"
            ) from e
        
        quantization_config = None
        if not use_gpu:
            quantization_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_compute_dtype="float16")
        
        device = 0 if use_gpu else -1
        self.pipe = pipeline(
            "text-generation", 
            model=model_name, 
            device=device,
            quantization_config=quantization_config,
            token=settings.HF_TOKEN
        )
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, token=settings.HF_TOKEN)

    def _get_diagram_type(self, prompt: str) -> str:
        prompt = prompt.lower()
        if "flowchart" in prompt:
            return "flowchart LR"
        if "sequence" in prompt or "payment" in prompt:
            return "sequenceDiagram"
        if "class" in prompt or "object" in prompt:
            return "classDiagram"
        return "flowchart LR"

    from functools import lru_cache
    @lru_cache(maxsize=100)
    def generate(self, prompt: str, style: str | None, complexity: str | None, services: tuple = ()) -> Dict[str, Any]:
        services = list(services) if services else None
        diagram_type = self._get_diagram_type(prompt)
        instruction = (
            "You are a senior software architect. Return ONLY a valid JSON object with keys: services, databases, apis, diagrams, notes, provided_services. "
            f"Generate a system design for the requirement: '{prompt}'. "
            f"Architecture style: {style or 'microservices'}. Complexity: {complexity or 'basic'}. "
            "Follow this schema:\n"
            "{\n"
            "  \"services\": [{\"name\": \"\", \"responsibilities\": [\"\"], \"techSuggestions\": [\"\"], \"events\": [\"\"]}],\n"
            "  \"databases\": [{\"name\": \"\", \"type\": \"postgres|mongo|dynamo\", \"schemaDDL\": \"\"}],\n"
            "  \"apis\": [{\"service\": \"\", \"path\": \"\", \"method\": \"GET|POST|PUT|DELETE\", \"requestSchema\": {}, \"responseSchema\": {}}],\n"
            "  \"diagrams\": [{\"type\": \"mermaid\", \"content\": \"\"}],\n"
            "  \"notes\": \"\",\n"
            "  \"provided_services\": []\n"
            "}\n"
            f"Include these services in the design and diagram: {', '.join(services) if services else 'none'}. "
            f"Generate a Mermaid diagram using '{diagram_type}'."
        )
        
        messages = [
            {"role": "system", "content": instruction},
            {"role": "user", "content": prompt},
        ]
        formatted_prompt = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        
        raw = self.pipe(formatted_prompt, max_new_tokens=1000, do_sample=True, temperature=0.7)[0]["generated_text"]
        json_text = self._extract_json(raw)
        
        try:
            data = json.loads(json_text)
            data["provided_services"] = services or []
            for diagram in data.get("diagrams", []):
                if diagram["type"] == "mermaid":
                    self._validate_mermaid(diagram["content"])
            return data
        except Exception:
            logger.error(f"HuggingFace parsing error: {json_text}")
            return _TemplateGenerator().generate(prompt, style, complexity, services)

    @staticmethod
    def _extract_json(text: str) -> str:
        m = re.search(r"\{.*\}", text, re.DOTALL | re.MULTILINE)
        if m:
            return squash_whitespace(m.group(0))
        return "{}"

    @staticmethod
    def _validate_mermaid(content: str):
        if not re.match(r'^(graph|sequenceDiagram|classDiagram|flowchart|gantt|stateDiagram)', content.strip()):
            raise ValueError("Invalid Mermaid diagram type")
        if "-->" not in content and "->" not in content and not content.strip().startswith("classDiagram"):
            raise ValueError("Mermaid diagram missing valid connections")

class _GroqGenerator:
    def __init__(self, api_key: str):
        try:
            from groq import Groq
        except ImportError as e:
            raise RuntimeError("Groq mode requested but 'groq' is not installed. Run `pip install groq`.") from e
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"

    def _get_diagram_type(self, prompt: str) -> str:
        prompt = prompt.lower()
        if "flowchart" in prompt:
            return "flowchart LR"
        if "sequence" in prompt or "payment" in prompt:
            return "sequenceDiagram"
        if "class" in prompt or "object" in prompt:
            return "classDiagram"
        return "flowchart LR"

    @staticmethod
    def _extract_json(text: str) -> str:
        m = re.search(r"\{.*\}", text, re.DOTALL | re.MULTILINE)
        if m:
            return squash_whitespace(m.group(0))
        return "{}"

    @staticmethod
    def _validate_mermaid(content: str):
        if not re.match(r'^(graph|sequenceDiagram|classDiagram|flowchart|gantt|stateDiagram)', content.strip()):
            raise ValueError("Invalid Mermaid diagram type")
        if "-->" not in content and "->" not in content and not content.strip().startswith("classDiagram"):
            raise ValueError("Mermaid diagram missing valid connections")

    from functools import lru_cache
    @lru_cache(maxsize=100)
    def generate(self, prompt: str, style: str | None, complexity: str | None, services: tuple = ()) -> Dict[str, Any]:
        services = list(services) if services else None
        diagram_type = self._get_diagram_type(prompt)
        instruction = (
            "You are a senior software architect. Return ONLY a valid JSON object with keys: services, databases, apis, diagrams, notes, provided_services. "
            f"Generate a system design for the requirement: '{prompt}'. "
            f"Architecture style: {style or 'microservices'}. Complexity: {complexity or 'basic'}. "
            "Follow this schema:\n"
            "{\n"
            "  \"services\": [{\"name\": \"\", \"responsibilities\": [\"\"], \"techSuggestions\": [\"\"], \"events\": [\"\"]}],\n"
            "  \"databases\": [{\"name\": \"\", \"type\": \"postgres|mongo|dynamo\", \"schemaDDL\": \"\"}],\n"
            "  \"apis\": [{\"service\": \"\", \"path\": \"\", \"method\": \"GET|POST|PUT|DELETE\", \"requestSchema\": {}, \"responseSchema\": {}}],\n"
            "  \"diagrams\": [{\"type\": \"mermaid\", \"content\": \"\"}],\n"
            "  \"notes\": \"\",\n"
            "  \"provided_services\": []\n"
            "}\n"
            f"Include these services in the design and diagram: {', '.join(services) if services else 'none'}. "
            f"Generate a Mermaid diagram using '{diagram_type}'."
        )
        
        messages = [
            {"role": "system", "content": instruction},
            {"role": "user", "content": prompt},
        ]

        try:
            resp = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=2000
            )
            raw = resp.choices[0].message.content
            json_text = self._extract_json(raw)
            data = json.loads(json_text)
            data["provided_services"] = services or []
            for diagram in data.get("diagrams", []):
                if diagram["type"] == "mermaid":
                    self._validate_mermaid(diagram["content"])
            return data
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {json_text}")
            return _TemplateGenerator().generate(prompt, style, complexity, services)
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return _TemplateGenerator().generate(prompt, style, complexity, services)

class LLMService:
    def __init__(self):
        self.backend = settings.MODEL_BACKEND
        if self.backend == "hf":
            self.engine = _HFGenerator(settings.MODEL_NAME, settings.USE_GPU)
        elif self.backend == "openai" and settings.OPENAI_API_KEY:
            self.engine = _OpenAIGenerator(settings.OPENAI_API_KEY)
        elif self.backend == "groq" and settings.GROQ_API_KEY:
            self.engine = _GroqGenerator(settings.GROQ_API_KEY)
        else:
            self.engine = _TemplateGenerator()

    def generate_system_design(self, prompt: str, style: str | None, complexity: str | None, services: List[str] | None = None) -> Dict[str, Any]:
        return self.engine.generate(prompt, style, complexity, tuple(services) if services else ())

# Singleton instance
llm_service = LLMService()