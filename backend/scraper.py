import asyncio
import logging
from playwright.async_api import async_playwright, Page, Browser, BrowserContext

class PlacasScraper:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.logger = logging.getLogger("PlacasScraper")
        logging.basicConfig(level=logging.INFO)
        self.base_url = "https://placaswebmercosul.com.br"

    async def start(self):
        if not self.playwright:
            self.playwright = await async_playwright().start()
        
        if not self.browser:
            # headless=False so we can see what's happening (optional)
            self.browser = await self.playwright.chromium.launch(headless=False, args=["--no-sandbox"])
        
        if not self.context:
            self.context = await self.browser.new_context()
        
        if not self.page:
            self.page = await self.context.new_page()

    async def login(self, username, password):
        await self.start()
        try:
            await self.page.goto(f"{self.base_url}/Login", timeout=60000)
            
            # Check if already logged in
            if "/Login" not in self.page.url:
                self.logger.info("Already logged in.")
                return True

            # Use generic selectors based on standard login forms
            # Adjust these selectors based on actual page inspection if needed
            # Assuming typically names like 'Usuario', 'Senha' or IDs
            # Based on common ASP.NET or similar structures
            
            # Try to find inputs. 
            # Note: User didn't give credentials yet, so this might fail or need refinement.
            # Using broad selectors for robustness
            await self.page.fill('input[name*="Usuario"], input[id*="Usuario"], input[name*="Cnpj"], input[id*="Cnpj"]', username)
            await self.page.fill('input[name*="Senha"], input[id*="Senha"], input[type="password"]', password)
            
            await self.page.click('button[type="submit"], input[type="submit"], .btn-primary')
            
            await self.page.wait_for_url(lambda u: "/Login" not in u, timeout=10000)
            return True
        except Exception as e:
            self.logger.error(f"Login failed: {e}")
            return False

    async def fetch_pipeline_data(self):
        await self.start()
        data = []
        
        try:
            # Navigate to "Pedidos de Placas"
            # We know from research the URL likely ends in /PedidoAutorizacao/Index or similar
            # Or we click through the menu
            await self.page.goto(f"{self.base_url}/PedidoAutorizacao/Index", timeout=60000)
            
            # Filter by "Todos" if needed to see all relevant data
            # Based on previous analysis, we need to click 'btnBuscar'
            # And maybe set a date range. For now, assuming default view or 'Todos' is accessible.
            
            # Let's try to grab rows
            rows = await self.page.query_selector_all('.table-scrollable tbody tr')
            
            for row in rows:
                # Extract basic fields
                cols = await row.query_selector_all('td')
                if len(cols) < 12: 
                    continue
                
                # Based on previous analysis:
                # 0: Dropdown
                # 1: ID (7970)
                # 2: Placa (FJG5E18)
                # 7: Proprietário 
                # 10: Situação
                # 11: Pago (Icon)
                
                placa = await cols[2].inner_text()
                proprietario = await cols[7].inner_text()
                situacao = await cols[10].inner_text()
                
                # Check Pago
                pago_icon = await cols[11].query_selector('.fa-check')
                flag_pago = True if pago_icon else False
                
                # ID for details
                item_id = await cols[1].inner_text()
                
                flag_foto = False
                
                # Rule: Check photos only if Paid and not Finalized/Fabricada
                # Optimization to avoid checking every single row
                if flag_pago and "Finalizada" not in situacao and "Fabricada" not in situacao:
                    flag_foto = await self.check_photos(item_id)
                elif "Finalizada" in situacao or "Fabricada" in situacao:
                    # If finished, assume photos are done or irrelevant
                    flag_foto = True
                
                data.append({
                    "id": item_id,
                    "placa": placa.strip(),
                    "proprietario": proprietario.strip(),
                    "situacao": situacao.strip(),
                    "flag_pago": flag_pago,
                    "flag_foto": flag_foto
                })
                
        except Exception as e:
            self.logger.error(f"Error fetching data: {e}")
        
        return data

    async def check_photos(self, item_id):
        try:
            # Navigate to detail/anexos page
            # Based on research: /PedidoAutorizacao/{id} or similar for "Anexos"
            # Previous analysis showed href="/PedidoAutorizacao/7970" on "Anexos" button
            # But that link might be just the "Edit" page
            # The "Anexos" button had class "btnAnexos".
            
            # Let's try navigating to the base edit page -> click Anexos tab?
            # Or maybe there is a specific URL for attachments.
            # Use the detected URL pattern:
            # href="/PedidoAutorizacao/7970" seems to be the main one.
            
            url = f"{self.base_url}/PedidoAutorizacao/{item_id}"
            await self.page.goto(url, timeout=30000)
            
            # Check for generic "Photos" or "Anexos" indicators
            # We are looking for something that denies presence, like "0 arquivos" 
            # or confirms presence like an image thumbnail.
            
            # Hypothesis: If we are on the page, look for 'img' tags in an 'anexos' section
            # or look for a specific 'Anexos' tab if it's a tabbed view.
            
            # For now, simplistic check: is there any uploaded file section?
            # Adjust based on real verification
            
            content = await self.page.content()
            if "Nenhum arquivo" in content or "Sem anexos" in content:
                return False
                
            # If we see "Foto Traseira" and "Visualizar" or similar
            if "Visualizar" in content or "Download" in content:
                return True
                
            return False # Default to False if unsure
        except:
            return False

    async def close(self):
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
            
scraper_instance = PlacasScraper()
