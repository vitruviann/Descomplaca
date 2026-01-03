from typing import List, Dict

class Gatekeeper:
    def __init__(self):
        # Database of services and their requirements
        self.services = {
            "renovacao_cnh": {
                "name": "Renovação de CNH",
                "requirements": [
                    "CNH vencida ou a vencer em 30 dias",
                    "Exame médico agendado (se necessário)",
                    "Taxa paga"
                ],
                "docs_needed": ["CNH Antiga", "Comprovante de Residência"]
            },
            "segunda_via_cnh": {
                "name": "2ª Via de CNH",
                "requirements": [
                    "Boletim de Ocorrência (em caso de roubo)",
                    "Taxa paga"
                ],
                "docs_needed": ["RG", "BO"]
            },
            "primeira_habilitacao": {
                 "name": "Primeira Habilitação",
                 "requirements": [
                     "18 anos completos",
                     "Saber ler e escrever"
                 ],
                 "docs_needed": ["RG", "CPF", "Comprovante Residência"]
            }
        }

    def get_available_services(self) -> Dict:
        return self.services

    def check_eligibility(self, service_id: str, user_data: Dict) -> bool:
        # Stub logic: simple check if service exists
        if service_id in self.services:
            return True
        return False

    def get_requirements(self, service_id: str) -> List[str]:
        return self.services.get(service_id, {}).get("requirements", [])

gatekeeper_service = Gatekeeper()
