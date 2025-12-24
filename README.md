API Routes
```

POST   /api/auth/login
→ Login single shop owner and set auth cookie

POST   /api/products/create
→ Create a new product (inventory item)

GET    /api/products
→ Get all products with current stock

POST   /api/stock/in
→ Increase product stock (restock / purchase)

POST   /api/stock/out
→ Decrease product stock (damage / loss / adjustment)

POST   /api/invoices/create
→ Create invoice as DRAFT or FINALIZED

POST   /api/invoices/finalize/:invoiceId
→ Finalize draft invoice and deduct inventory

GET    /api/invoices
→ Get all invoices

GET    /api/invoices?type=draft
→ Get only draft invoices

GET    /api/invoices?type=finalized
→ Get only finalized invoices
```