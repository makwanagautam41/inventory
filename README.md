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

GET    /api/invoices
→ Get all invoices

GET    /api/invoices?type=draft
→ Get only draft invoices

GET    /api/invoices?type=finalized
→ Get only finalized invoices
```


## 🧠 How This Backend Works (Detailed Explanation)

## 1️⃣ Product: What You Sell

A **Product** represents an item that exists in your shop catalog.

Example:
- Keyboard
- Mouse
- Monitor

### Important Rules
- Creating a product does **NOT** add stock
- A product only defines:
  - Name
  - Price
  - SKU (unique identifier)
  - Low stock limit
- Product quantity always starts at `0`

### Why This Design?
In real shops, you:
- First define what items you sell
- Later purchase stock

This separation prevents:
- Fake inventory
- Incorrect stock counts
- Manual mistakes

---

## 2️⃣ Stock: How Much You Have

Stock represents the **actual quantity available** for a product.

Stock is **never edited directly**.

It changes ONLY through:
- Stock IN
- Stock OUT
- Invoice Finalization

This ensures **inventory accuracy**.

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
3. StockHistory record is created (type = IN)

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

### What Happens Internally
1. Product is fetched
2. Stock availability is validated
3. Quantity is reduced
4. StockHistory record is created (type = OUT)

---

## 5️⃣ Invoice: Selling Products

Invoices represent **sales transactions**.

Invoices have two states:
- DRAFT
- FINALIZED

### Draft Invoice
- Created when customer items are selected
- Does NOT affect stock
- Can be edited or finalized later

### Why Draft Exists
In real shops:
- Billing is prepared first
- Stock should change only after confirmation

---

## 6️⃣ Invoice Finalization: Actual Sale

Finalizing an invoice is the **only place where sales reduce stock**.

### What Happens on Finalization
1. Invoice is validated
2. Each product’s stock is checked
3. Product quantities are reduced
4. StockHistory records are created:
   - type = OUT
   - referenceType = INVOICE
5. Invoice status becomes FINALIZED

If stock is insufficient:
- Finalization is rejected
- Inventory remains unchanged

---

## 7️⃣ Stock History: Inventory Memory (Audit Trail)

StockHistory is the **most important part** of this backend.

It records:
- Every Stock IN
- Every Stock OUT
- Every Invoice-based stock reduction

### What Each Record Answers
- Which product?
- What action? (IN / OUT)
- How much quantity?
- Why did it happen?
- When did it happen?

StockHistory is:
- Immutable
- Never edited
- Never deleted

---

## 8️⃣ Why Stock History Is Critical

StockHistory allows you to:
- Audit inventory
- Debug stock issues
- Verify sales
- Build reports
- Prove inventory changes

Products show the **current state**  
StockHistory shows **how you reached that state**

This is how professional inventory systems work.

---

## 🔁 Complete Inventory Lifecycle

