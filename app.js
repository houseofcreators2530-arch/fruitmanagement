/* =====================================================
   FRUIT MANAGEMENT APP
   ===================================================== */


/* -----------------------------
   DATABASE
----------------------------- */

const DB = {

    products: JSON.parse(localStorage.getItem("products")) || [],

    dealers: JSON.parse(localStorage.getItem("dealers")) || [],

    clients: JSON.parse(localStorage.getItem("clients")) || [],

    purchases: JSON.parse(localStorage.getItem("purchases")) || [],

    sales: JSON.parse(localStorage.getItem("sales")) || []

};


/* -----------------------------
   SAVE DATABASE
----------------------------- */

function saveDB() {

    localStorage.setItem("products", JSON.stringify(DB.products));

    localStorage.setItem("dealers", JSON.stringify(DB.dealers));

    localStorage.setItem("clients", JSON.stringify(DB.clients));

    localStorage.setItem("purchases", JSON.stringify(DB.purchases));

    localStorage.setItem("sales", JSON.stringify(DB.sales));

}


/* -----------------------------
   COMPANY
----------------------------- */

let companyName =
    localStorage.getItem("companyName") ||
    "Fruit Business";

document.getElementById("companyName").innerText = companyName;
document.getElementById("sideCompanyName").innerText = companyName;


/* -----------------------------
   REAL TIME DATE
----------------------------- */

function updateDateTime() {

    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    document.getElementById("currentDateTime").innerText =
        `${date} • ${time}`;

}

setInterval(updateDateTime, 1000);
updateDateTime();


/* -----------------------------
   SIDEBAR
----------------------------- */

function openSidebar() {

    document.getElementById("sidebar").classList.add("active");

    document.getElementById("overlay").classList.add("active");

}

function closeSidebar() {

    document.getElementById("sidebar").classList.remove("active");

    document.getElementById("overlay").classList.remove("active");

}


/* -----------------------------
   PAGE ROUTER
----------------------------- */

function showPage(page) {

    closeSidebar();

    switch(page) {

        case "dashboard":
            dashboardPage();
            break;

        case "products":
            productsPage();
            break;

        case "purchases":
            purchasesPage();
            break;

        case "purchaseDealers":
            dealersPage();
            break;

        case "sales":
            salesPage();
            break;

        case "saleClients":
            clientsPage();
            break;

        case "stock":
            stockPage();
            break;

        case "reports":
            reportsPage();
            break;

        case "settings":
            settingsPage();
            break;

        default:
            dashboardPage();

    }

}


/* =====================================================
   DASHBOARD
===================================================== */

function dashboardPage() {

    let totalProducts = DB.products.length;

    let totalStock = DB.products.reduce(
        (sum, p) => sum + (p.stock || 0),
        0
    );

    let purchaseAmount = DB.purchases.reduce(
        (sum, p) => sum + Number(p.total || 0),
        0
    );

    let salesAmount = DB.sales.reduce(
        (sum, s) => sum + Number(s.total || 0),
        0
    );


    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">
            <h2>Dashboard</h2>
            <p>Business overview</p>
        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <div class="icon">🍎</div>
                <div class="label">Products</div>
                <div class="value">${totalProducts}</div>
            </div>

            <div class="stat-card">
                <div class="icon">📦</div>
                <div class="label">Stock</div>
                <div class="value">${formatQuantity(totalStock)}</div>
            </div>

            <div class="stat-card">
                <div class="icon">📥</div>
                <div class="label">Purchases</div>
                <div class="value">₹${purchaseAmount.toLocaleString("en-IN")}</div>
            </div>

            <div class="stat-card">
                <div class="icon">📤</div>
                <div class="label">Sales</div>
                <div class="value">₹${salesAmount.toLocaleString("en-IN")}</div>
            </div>

        </div>


        <div class="section">

            <div class="section-header">

                <h3>Quick Actions</h3>

            </div>

            <div class="form-grid">

                <button class="btn" onclick="openPurchaseModal()">
                    📥 Add Purchase
                </button>

                <button class="btn" onclick="openSaleModal()">
                    📤 Add Sale
                </button>

                <button class="btn btn-secondary" onclick="openProductModal()">
                    🍎 Add Product
                </button>

                <button class="btn btn-secondary" onclick="openDealerModal()">
                    👨‍🌾 Add Dealer
                </button>

            </div>

        </div>


        <div class="section">

            <div class="section-header">
                <h3>Current Stock</h3>

                <button
                    class="btn btn-secondary"
                    onclick="showPage('stock')">
                    View All
                </button>

            </div>

            ${stockPreview()}

        </div>

    `;

}


/* =====================================================
   PRODUCT
===================================================== */

function productsPage() {

    let html = `

        <div class="page-title">

            <h2>Products</h2>

            <p>Manage fruits and current stock</p>

        </div>


        <div class="section">

            <button
                class="btn"
                onclick="openProductModal()">

                + Create Product

            </button>

        </div>

    `;


    if (DB.products.length === 0) {

        html += emptyState(
            "🍎",
            "No products added yet"
        );

    } else {

        html += `

            <div class="section">

                ${DB.products.map(product => `

                    <div class="list-item">

                        <div>

                            <div class="list-name">
                                ${escapeHTML(product.name)}
                            </div>

                            <div class="list-sub">
                                ${product.unit}
                            </div>

                        </div>

                        <div class="list-value">

                            ${formatQuantity(product.stock)}
                            <br>

                            <span class="badge badge-green">
                                ${product.unit}
                            </span>

                        </div>

                    </div>

                `).join("")}

            </div>

        `;

    }


    document.getElementById("pageContent").innerHTML = html;

}


/* PRODUCT MODAL */

function openProductModal() {

    openModal(
        "Create Product",

        `

        <form onsubmit="createProduct(event)">

            <div class="form-group">

                <label>Product Name</label>

                <input
                    id="productName"
                    placeholder="e.g. Apple"
                    required>

            </div>


            <div class="form-group">

                <label>Unit</label>

                <select id="productUnit">

                    <option value="KG">KG + Grams</option>

                    <option value="PCS">Pieces</option>

                    <option value="DOZEN">Dozen</option>

                </select>

            </div>


            <div class="form-group">

                <label>Opening Stock</label>

                <input
                    id="productStock"
                    type="number"
                    step="0.001"
                    value="0"
                    min="0">

            </div>


            <div class="form-group">

                <label>Purchase Rate</label>

                <input
                    id="purchaseRate"
                    type="number"
                    step="0.01"
                    value="0">

            </div>


            <div class="form-group">

                <label>Sale Rate</label>

                <input
                    id="saleRate"
                    type="number"
                    step="0.01"
                    value="0">

            </div>


            <button class="btn" style="width:100%">
                Save Product
            </button>

        </form>

        `
    );

}


function createProduct(event) {

    event.preventDefault();

    const name =
        document.getElementById("productName").value.trim();

    const unit =
        document.getElementById("productUnit").value;

    let stock =
        Number(document.getElementById("productStock").value);

    if (unit === "KG") {

        stock = stock * 1000;

    }


    const product = {

        id: Date.now(),

        name,

        unit,

        stock,

        purchaseRate:
            Number(document.getElementById("purchaseRate").value),

        saleRate:
            Number(document.getElementById("saleRate").value)

    };


    DB.products.push(product);

    saveDB();

    closeModal();

    productsPage();

}


/* =====================================================
   PURCHASE DEALERS
===================================================== */

function dealersPage() {

    let html = `

        <div class="page-title">

            <h2>Purchase Dealers</h2>

            <p>Suppliers from whom fruits are purchased</p>

        </div>


        <div class="section">

            <button
                class="btn"
                onclick="openDealerModal()">

                + Create Purchase Dealer

            </button>

        </div>

    `;


    if (DB.dealers.length === 0) {

        html += emptyState(
            "👨‍🌾",
            "No purchase dealers"
        );

    } else {

        html += `

            <div class="section">

                ${DB.dealers.map(dealer => {

                    const purchases =
                        DB.purchases.filter(
                            p => p.dealerId == dealer.id
                        );

                    const total =
                        purchases.reduce(
                            (sum, p) => sum + Number(p.total || 0),
                            0
                        );

                    return `

                        <div
                            class="list-item"
                            onclick="dealerHistory(${dealer.id})">

                            <div>

                                <div class="list-name">
                                    ${escapeHTML(dealer.name)}
                                </div>

                                <div class="list-sub">
                                    ${dealer.phone || "No phone"}
                                </div>

                            </div>

                            <div class="list-value">

                                ₹${total.toLocaleString("en-IN")}

                                <br>

                                <span class="badge badge-green">
                                    ${purchases.length} Purchases
                                </span>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }


    document.getElementById("pageContent").innerHTML = html;

}


/* DEALER MODAL */

function openDealerModal() {

    openModal(

        "Create Purchase Dealer",

        `

        <form onsubmit="createDealer(event)">

            <div class="form-group">

                <label>Dealer Name</label>

                <input
                    id="dealerName"
                    required
                    placeholder="Dealer / Supplier Name">

            </div>


            <div class="form-group">

                <label>Mobile</label>

                <input
                    id="dealerPhone"
                    type="tel"
                    placeholder="Mobile Number">

            </div>


            <div class="form-group">

                <label>Address</label>

                <textarea id="dealerAddress"></textarea>

            </div>


            <button class="btn" style="width:100%">
                Save Dealer
            </button>

        </form>

        `
    );

}


function createDealer(event) {

    event.preventDefault();

    DB.dealers.push({

        id: Date.now(),

        name:
            document.getElementById("dealerName").value.trim(),

        phone:
            document.getElementById("dealerPhone").value.trim(),

        address:
            document.getElementById("dealerAddress").value.trim()

    });


    saveDB();

    closeModal();

    dealersPage();

}


/* DEALER HISTORY */

function dealerHistory(id) {

    const dealer =
        DB.dealers.find(d => d.id == id);

    const purchases =
        DB.purchases.filter(p => p.dealerId == id);


    let rows = purchases.map(p => `

        <tr>

            <td>${formatDate(p.date)}</td>

            <td>${p.invoice || "-"}</td>

            <td>₹${Number(p.total).toLocaleString("en-IN")}</td>

        </tr>

    `).join("");


    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>${escapeHTML(dealer.name)}</h2>

            <p>Purchase history</p>

        </div>


        <div class="section">

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Invoice</th>
                            <th>Amount</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows || `

                            <tr>
                                <td colspan="3">
                                    No purchases yet
                                </td>
                            </tr>

                        `}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =====================================================
   CLIENTS
===================================================== */

function clientsPage() {

    let html = `

        <div class="page-title">

            <h2>Sale Clients</h2>

            <p>Customers to whom fruits are sold</p>

        </div>


        <div class="section">

            <button
                class="btn"
                onclick="openClientModal()">

                + Create Sale Client

            </button>

        </div>

    `;


    if (DB.clients.length === 0) {

        html += emptyState(
            "👤",
            "No sale clients"
        );

    } else {

        html += `

            <div class="section">

                ${DB.clients.map(client => {

                    const sales =
                        DB.sales.filter(
                            s => s.clientId == client.id
                        );

                    const total =
                        sales.reduce(
                            (sum, s) => sum + Number(s.total || 0),
                            0
                        );

                    return `

                        <div
                            class="list-item"
                            onclick="clientHistory(${client.id})">

                            <div>

                                <div class="list-name">
                                    ${escapeHTML(client.name)}
                                </div>

                                <div class="list-sub">
                                    ${client.phone || "No phone"}
                                </div>

                            </div>

                            <div class="list-value">

                                ₹${total.toLocaleString("en-IN")}

                                <br>

                                <span class="badge badge-green">
                                    ${sales.length} Sales
                                </span>

                            </div>

                        </div>

                    `;

                }).join("")}

            </div>

        `;

    }


    document.getElementById("pageContent").innerHTML = html;

}


/* CLIENT MODAL */

function openClientModal() {

    openModal(

        "Create Sale Client",

        `

        <form onsubmit="createClient(event)">

            <div class="form-group">

                <label>Client Name</label>

                <input
                    id="clientName"
                    required
                    placeholder="Customer Name">

            </div>


            <div class="form-group">

                <label>Mobile</label>

                <input
                    id="clientPhone"
                    type="tel">

            </div>


            <div class="form-group">

                <label>Address</label>

                <textarea id="clientAddress"></textarea>

            </div>


            <button class="btn" style="width:100%">
                Save Client
            </button>

        </form>

        `
    );

}


function createClient(event) {

    event.preventDefault();

    DB.clients.push({

        id: Date.now(),

        name:
            document.getElementById("clientName").value.trim(),

        phone:
            document.getElementById("clientPhone").value.trim(),

        address:
            document.getElementById("clientAddress").value.trim()

    });


    saveDB();

    closeModal();

    clientsPage();

}


/* CLIENT HISTORY */

function clientHistory(id) {

    const client =
        DB.clients.find(c => c.id == id);

    const sales =
        DB.sales.filter(s => s.clientId == id);


    let rows = sales.map(s => `

        <tr>

            <td>${formatDate(s.date)}</td>

            <td>${s.invoice || "-"}</td>

            <td>₹${Number(s.total).toLocaleString("en-IN")}</td>

        </tr>

    `).join("");


    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>${escapeHTML(client.name)}</h2>

            <p>Sales history</p>

        </div>


        <div class="section">

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Invoice</th>
                            <th>Amount</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows || `

                            <tr>
                                <td colspan="3">
                                    No sales yet
                                </td>
                            </tr>

                        `}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =====================================================
   PURCHASE
===================================================== */

function purchasesPage() {

    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>Purchases</h2>

            <p>Stock coming into the business</p>

        </div>


        <div class="section">

            <button
                class="btn"
                onclick="openPurchaseModal()">

                + Add Purchase

            </button>

        </div>


        <div class="section">

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Dealer</th>
                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${DB.purchases.map(p => {

                            const dealer =
                                DB.dealers.find(
                                    d => d.id == p.dealerId
                                );

                            return `

                                <tr>

                                    <td>
                                        ${formatDate(p.date)}
                                    </td>

                                    <td>
                                        ${dealer?.name || "-"}
                                    </td>

                                    <td>
                                        ₹${Number(p.total).toLocaleString("en-IN")}
                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function openPurchaseModal() {

    const dealerOptions =
        DB.dealers.map(d =>
            `<option value="${d.id}">
                ${escapeHTML(d.name)}
            </option>`
        ).join("");


    const productOptions =
        DB.products.map(p =>
            `<option value="${p.id}">
                ${escapeHTML(p.name)}
            </option>`
        ).join("");


    openModal(

        "Add Purchase",

        `

        <form onsubmit="createPurchase(event)">

            <div class="form-group">

                <label>Purchase Dealer</label>

                <select id="purchaseDealer" required>

                    <option value="">
                        Select Dealer
                    </option>

                    ${dealerOptions}

                </select>

            </div>


            <div class="form-group">

                <label>Product</label>

                <select id="purchaseProduct" required>

                    <option value="">
                        Select Product
                    </option>

                    ${productOptions}

                </select>

            </div>


            <div class="form-group">

                <label>Quantity</label>

                <input
                    id="purchaseQty"
                    type="number"
                    step="0.001"
                    min="0.001"
                    required>

            </div>


            <div class="form-group">

                <label>Rate</label>

                <input
                    id="purchaseRateEntry"
                    type="number"
                    step="0.01"
                    min="0"
                    required>

            </div>


            <div class="form-group">

                <label>Invoice No.</label>

                <input id="purchaseInvoice">

            </div>


            <button class="btn" style="width:100%">
                Save Purchase
            </button>

        </form>

        `
    );

}


function createPurchase(event) {

    event.preventDefault();

    const product =
        DB.products.find(
            p => p.id == document.getElementById("purchaseProduct").value
        );


    let qty =
        Number(document.getElementById("purchaseQty").value);

    if (product.unit === "KG") {

        qty = qty * 1000;

    }


    const rate =
        Number(document.getElementById("purchaseRateEntry").value);


    const purchase = {

        id: Date.now(),

        date: new Date().toISOString(),

        dealerId:
            Number(document.getElementById("purchaseDealer").value),

        productId:
            product.id,

        quantity:
            qty,

        rate,

        total:
            (product.unit === "KG"
                ? qty / 1000
                : qty) * rate,

        invoice:
            document.getElementById("purchaseInvoice").value

    };


    DB.purchases.push(purchase);

    product.stock += qty;

    saveDB();

    closeModal();

    purchasesPage();

}


/* =====================================================
   SALES
===================================================== */

function salesPage() {

    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>Sales</h2>

            <p>Stock going out to clients</p>

        </div>


        <div class="section">

            <button
                class="btn"
                onclick="openSaleModal()">

                + Add Sale

            </button>

        </div>


        <div class="section">

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Date</th>
                            <th>Client</th>
                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${DB.sales.map(s => {

                            const client =
                                DB.clients.find(
                                    c => c.id == s.clientId
                                );

                            return `

                                <tr>

                                    <td>
                                        ${formatDate(s.date)}
                                    </td>

                                    <td>
                                        ${client?.name || "-"}
                                    </td>

                                    <td>
                                        ₹${Number(s.total).toLocaleString("en-IN")}
                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function openSaleModal() {

    const clientOptions =
        DB.clients.map(c =>
            `<option value="${c.id}">
                ${escapeHTML(c.name)}
            </option>`
        ).join("");


    const productOptions =
        DB.products.map(p =>
            `<option value="${p.id}">
                ${escapeHTML(p.name)}
            </option>`
        ).join("");


    openModal(

        "Add Sale",

        `

        <form onsubmit="createSale(event)">

            <div class="form-group">

                <label>Sale Client</label>

                <select id="saleClient" required>

                    <option value="">
                        Select Client
                    </option>

                    ${clientOptions}

                </select>

            </div>


            <div class="form-group">

                <label>Product</label>

                <select id="saleProduct" required>

                    <option value="">
                        Select Product
                    </option>

                    ${productOptions}

                </select>

            </div>


            <div class="form-group">

                <label>Quantity</label>

                <input
                    id="saleQty"
                    type="number"
                    step="0.001"
                    min="0.001"
                    required>

            </div>


            <div class="form-group">

                <label>Sale Rate</label>

                <input
                    id="saleRateEntry"
                    type="number"
                    step="0.01"
                    min="0"
                    required>

            </div>


            <div class="form-group">

                <label>Invoice No.</label>

                <input id="saleInvoice">

            </div>


            <button class="btn" style="width:100%">
                Save Sale
            </button>

        </form>

        `
    );

}


function createSale(event) {

    event.preventDefault();

    const product =
        DB.products.find(
            p => p.id == document.getElementById("saleProduct").value
        );


    let qty =
        Number(document.getElementById("saleQty").value);


    if (product.unit === "KG") {

        qty = qty * 1000;

    }


    if (qty > product.stock) {

        alert("Not enough stock available.");

        return;

    }


    const rate =
        Number(document.getElementById("saleRateEntry").value);


    const sale = {

        id: Date.now(),

        date: new Date().toISOString(),

        clientId:
            Number(document.getElementById("saleClient").value),

        productId:
            product.id,

        quantity:
            qty,

        rate,

        total:
            (product.unit === "KG"
                ? qty / 1000
                : qty) * rate,

        invoice:
            document.getElementById("saleInvoice").value

    };


    DB.sales.push(sale);

    product.stock -= qty;

    saveDB();

    closeModal();

    salesPage();

}


/* =====================================================
   STOCK
===================================================== */

function stockPage() {

    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>Current Stock</h2>

            <p>Live available stock</p>

        </div>


        <div class="section">

            <div class="table-wrapper">

                <table>

                    <thead>

                        <tr>

                            <th>Product</th>
                            <th>Stock</th>
                            <th>Unit</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${DB.products.map(p => `

                            <tr>

                                <td>
                                    ${escapeHTML(p.name)}
                                </td>

                                <td>
                                    ${formatQuantity(p.stock)}
                                </td>

                                <td>
                                    ${p.unit}
                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =====================================================
   REPORTS
===================================================== */

function reportsPage() {

    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>Reports</h2>

            <p>Business reports and analysis</p>

        </div>


        <div class="section">

            <h3>📦 Stock Report</h3>

            <p style="color:#718078;margin-top:8px">
                Current product-wise stock.
            </p>

            <button
                class="btn"
                style="margin-top:12px"
                onclick="stockPage()">

                Open Stock Report

            </button>

        </div>


        <div class="section">

            <h3>📥 Purchase Report</h3>

            <p style="color:#718078;margin-top:8px">
                Dealer-wise and date-wise purchases.
            </p>

            <button
                class="btn"
                style="margin-top:12px"
                onclick="purchasesPage()">

                Open Purchase Report

            </button>

        </div>


        <div class="section">

            <h3>📤 Sales Report</h3>

            <p style="color:#718078;margin-top:8px">
                Client-wise and date-wise sales.
            </p>

            <button
                class="btn"
                style="margin-top:12px"
                onclick="salesPage()">

                Open Sales Report

            </button>

        </div>


        <div class="section">

            <h3>💰 Sales Summary</h3>

            <div style="margin-top:12px">

                Total Sales:

                <strong>
                    ₹${DB.sales.reduce(
                        (sum,s)=>sum+Number(s.total||0),
                        0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>


            <div style="margin-top:8px">

                Total Purchase:

                <strong>
                    ₹${DB.purchases.reduce(
                        (sum,p)=>sum+Number(p.total||0),
                        0
                    ).toLocaleString("en-IN")}
                </strong>

            </div>

        </div>

    `;

}


/* =====================================================
   SETTINGS
===================================================== */

function settingsPage() {

    document.getElementById("pageContent").innerHTML = `

        <div class="page-title">

            <h2>Settings</h2>

            <p>Business settings</p>

        </div>


        <div class="section">

            <div class="form-group">

                <label>Company Name</label>

                <input
                    id="newCompanyName"
                    value="${escapeHTML(companyName)}">

            </div>


            <button
                class="btn"
                onclick="saveCompanyName()">

                Save Company Name

            </button>

        </div>

    `;

}


function saveCompanyName() {

    const name =
        document.getElementById("newCompanyName").value.trim();

    if (!name) return;

    companyName = name;

    localStorage.setItem("companyName", name);

    document.getElementById("companyName").innerText = name;

    document.getElementById("sideCompanyName").innerText = name;

    alert("Company name updated.");

}


/* =====================================================
   MODAL
===================================================== */

function openModal(title, content) {

    document.getElementById("modalTitle").innerText = title;

    document.getElementById("modalContent").innerHTML = content;

    document.getElementById("modal").classList.add("active");

}


function closeModal() {

    document.getElementById("modal").classList.remove("active");

}


/* =====================================================
   HELPERS
===================================================== */

function formatDate(date) {

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


function formatQuantity(value) {

    if (!value) return "0";

    return Number(value).toLocaleString("en-IN");

}


function stockPreview() {

    if (DB.products.length === 0) {

        return emptyState(
            "📦",
            "No stock available"
        );

    }


    return DB.products.slice(0, 5).map(p => `

        <div class="list-item">

            <div>

                <div class="list-name">
                    ${escapeHTML(p.name)}
                </div>

                <div class="list-sub">
                    Current Stock
                </div>

            </div>

            <div class="list-value">

                ${formatQuantity(p.stock)}

                <span class="badge badge-green">
                    ${p.unit}
                </span>

            </div>

        </div>

    `).join("");

}


function emptyState(icon, text) {

    return `

        <div class="empty">

            <div class="empty-icon">
                ${icon}
            </div>

            <div>
                ${text}
            </div>

        </div>

    `;

}


function escapeHTML(str) {

    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* -----------------------------
   START APP
----------------------------- */

dashboardPage();