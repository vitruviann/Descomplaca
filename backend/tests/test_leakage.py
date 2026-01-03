
import pytest
from pydantic import ValidationError
from routers.proposals import ProposalCreate, ProposalResponse

def test_anti_leakage_phone():
    with pytest.raises(ValueError) as excinfo:
        ProposalCreate(
            order_id=1,
            dispatcher_id=1,
            fee_value=100.0,
            tax_value=50.0,
            estimated_days=2,
            description="Me liga no 11999990000"
        )
    assert "Sensitive info (phone) detected" in str(excinfo.value)

def test_anti_leakage_email():
    with pytest.raises(ValueError) as excinfo:
        ProposalCreate(
            order_id=1,
            dispatcher_id=1,
            fee_value=100.0,
            tax_value=50.0,
            estimated_days=2,
            description="Manda email para contato@teste.com"
        )
    assert "Sensitive info (email) detected" in str(excinfo.value)

def test_safe_description():
    prop = ProposalCreate(
        order_id=1,
        dispatcher_id=1,
        fee_value=100.0,
        tax_value=50.0,
        estimated_days=2,
        description="Olá, sou credenciado e posso resolver em 2 dias."
    )
    assert prop.description == "Olá, sou credenciado e posso resolver em 2 dias."
