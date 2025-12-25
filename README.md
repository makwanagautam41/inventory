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

GET    /api/stock/history
→ Shows the actual history of past stocks what happpend in the backend

POST   /api/invoices/create
→ Create invoice as DRAFT or FINALIZED

POST   /api/invoices/finalize/:invoiceId
→ Finalize draft invoice and deduct inventory

POST   /api/invoices/cancel/:invoiceId
→ Cancel the invoice and update the inventory

GET    /api/invoices
→ Get all invoices

GET    /api/invoices?type=draft
→ Get only draft invoices

GET    /api/invoices?type=finalized
→ Get only finalized invoices

GET    /api/invoices?type=cancelled
→ Get only finalized invoices
```



---

## 🧠 How This Backend Works (Detailed Explanation)

This backend is built around **four core business concepts**:

1. Products
2. Stock
3. Invoices
4. Stock History (Audit Trail)

Each concept has **strict rules** to ensure data integrity.

---

## 1️⃣ Product: What You Sell

A **Product** represents an item that exists in your shop catalog.

Examples:
- Keyboard
- Mouse
- Monitor

### Important Rules
- Creating a product does **NOT** add stock
- A product only defines:
  - Name
  - Price
  - SKU (unique)
  - Low stock limit
- Product quantity always starts at `0`

### Why This Design?
In real shops:
- You define products first
- You purchase stock later

This separation prevents:
- Fake inventory
- Incorrect stock counts
- Manual errors

---

## 2️⃣ Stock: How Much You Have

Stock represents the **actual quantity available** for a product.

Stock is **never edited directly**.

It changes ONLY through:
- Stock IN
- Stock OUT
- Invoice Finalization
- Invoice Cancellation (rollback)

This guarantees inventory accuracy.

---

## 3️⃣ Stock IN: Increasing Inventory

Stock IN is used when inventory comes **into** the shop.

### Use Cases
- Purchasing goods
- Restocking
- Customer returns

### What Happens Internally
1. Product is fetched
2. Quantity is increased
3. StockHistory entry is created (type = IN)

Stock IN immediately affects inventory.

---

## 4️⃣ Stock OUT: Manual Inventory Reduction

Stock OUT is used for **non-sale reductions**.

### Use Cases
- Damaged items
- Lost items
- Expired goods
- Manual correction

### What Stock OUT Is NOT
- It is NOT a sale
- It does NOT involve invoices

### Internal Flow
1. Product is fetched
2. Stock availability is validated
3. Quantity is reduced
4. StockHistory entry is created (type = OUT)

---

## 5️⃣ Invoice: Selling Products

Invoices represent **sales transactions**.

Invoices have three states:
- DRAFT
- FINALIZED
- CANCELLED

---

### Draft Invoice
- Created when customer items are selected
- Does NOT affect stock
- Can be finalized later

This mirrors real billing workflows.

---

## 6️⃣ Backend-Controlled Invoice Calculations

Frontend sends:
- productId
- quantity

Backend calculates:
- Item price
- Item total
- Subtotal
- Tax
- Discount
- Grand total

This prevents:
- Price manipulation
- Calculation errors
- Security risks

The backend is the **only authority for money**.

---

## 7️⃣ Invoice Finalization: Actual Sale

Finalizing an invoice is the **only place where sales reduce stock**.

### What Happens on Finalization
1. Invoice is validated
2. Product stock is checked
3. Product quantities are reduced
4. StockHistory entries are created:
   - type = OUT
   - referenceType = INVOICE
5. Invoice status becomes FINALIZED

If stock is insufficient:
- Finalization fails
- Inventory remains unchanged

---

## 8️⃣ Invoice Cancellation & Rollback

Invoice cancellation completes the **sales lifecycle**.

### Rules
- Only FINALIZED invoices can be cancelled
- Draft invoices do not affect stock
- Cancelled invoices cannot be finalized again

### What Happens on Cancellation
1. Invoice is validated
2. Product quantities are restored
3. StockHistory entries are created:
   - type = IN
   - referenceType = CANCEL
4. Invoice status becomes CANCELLED

This guarantees:
- No inventory corruption
- Full auditability

---

## 9️⃣ Stock History: Inventory Memory (Audit Trail)

StockHistory records **every stock movement**.

It tracks:
- Stock IN
- Stock OUT
- Invoice sales
- Invoice cancellations

Each record answers:
- Which product?
- What happened?
- How much quantity?
- Why did it happen?
- When did it happen?

### Rules
- Immutable
- Never edited
- Never deleted

---

## 🔍 Why Stock History Is Critical

StockHistory allows you to:
- Audit inventory
- Debug stock mismatches
- Verify sales
- Generate reports
- Prove inventory changes

Products show the **current state**  
StockHistory shows **how you reached that state**

This is how professional inventory systems work.

---

## 🔁 Complete Inventory Lifecycle

