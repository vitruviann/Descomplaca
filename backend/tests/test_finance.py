
import pytest
from routers.payments import DESCOMPLACA_COMMISSION_PERCENT

def test_split_calculation():
    fee_value = 500.00
    tax_value = 200.00
    total_value = fee_value + tax_value 
    
    commission = fee_value * DESCOMPLACA_COMMISSION_PERCENT
    dispatcher_receive = total_value - commission
    
    assert commission == 50.00
    assert dispatcher_receive == 650.00
    
    split_config = [
        {
            "walletId": "wallet_mock",
            "fixedValue": dispatcher_receive,
        }
    ]
    
    assert split_config[0]['fixedValue'] == 650.00
