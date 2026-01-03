
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ASAAS_API_URL = os.getenv("ASAAS_API_URL", "https://sandbox.asaas.com/api/v3")
ASAAS_API_KEY = os.getenv("ASAAS_API_KEY")

class AsaasService:
    def __init__(self):
        self.headers = {
            "access_token": ASAAS_API_KEY,
            "Content-Type": "application/json"
        }
        self.base_url = ASAAS_API_URL

    async def create_customer(self, name: str, cpf_cnpj: str, email: str = None, phone: str = None):
        """Creates a new customer in Asaas"""
        payload = {
            "name": name,
            "cpfCnpj": cpf_cnpj,
            "email": email,
            "mobilePhone": phone
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/customers",
                json=payload,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def create_payment(self, customer_id: str, billing_type: str, value: float, due_date: str, description: str, split: list = None):
        """
        Creates a payment.
        
        split format:
        [
            {
                "walletId": "subaccount_wallet_id",
                "fixedValue": 10.00,
                "percentualValue": None
            }
        ]
        """
        payload = {
            "customer": customer_id,
            "billingType": billing_type, # 'PIX', 'CREDIT_CARD', 'BOLETO'
            "value": value,
            "dueDate": due_date,
            "description": description
        }
        
        if split:
            payload["split"] = split
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/payments",
                json=payload,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def create_subaccount(self, name: str, email: str, cpf_cnpj: str, mobile_phone: str, postal_code: str, address: str, address_number: str, birth_date: str = None):
        """Creates a subaccount for the Dispatcher (white-label equivalent or simply connected account)"""
        # Note: Asaas has specific endpoints for subaccounts. Using standard /accounts here.
        
        payload = {
            "name": name,
            "email": email,
            "cpfCnpj": cpf_cnpj,
            "mobilePhone": mobile_phone,
            "postalCode": postal_code,
            "address": address,
            "addressNumber": address_number,
            "birthDate": birth_date # Required for PF
            # "companyType": "LIMITED" etc if PJ
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/accounts",
                json=payload,
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

asaas_service = AsaasService()
