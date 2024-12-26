    // Function to calculate item price
    function calculateItemPrice(item) {
        const rate = parseFloat(item.querySelector('.itemRate').value);
        const quantity = parseInt(item.querySelector('.itemQuantity').value);
        if (!isNaN(rate) && !isNaN(quantity)) {
            const price = rate * quantity;
            item.querySelector('.itemPrice').value = price.toFixed(2);
            return price;
        } else {
            item.querySelector('.itemPrice').value = '';
            return 0;
        }
    }

    // Function to add more items dynamically
    function addItem() {
        const itemSection = document.getElementById('itemSection');
        const newItem = document.createElement('div');
        newItem.classList.add('item-entry');
        newItem.innerHTML = `
            <div class="form-group">
                <label for="itemName">Item Name</label>
                <input type="text" class="form-control itemName" required>
            </div>
            <div class="form-group">
                <label for="itemRate">Item Rate (per unit)</label>
                <input type="number" class="form-control itemRate" required>
            </div>
            <div class="form-group">
                <label for="itemQuantity">Item Quantity</label>
                <input type="number" class="form-control itemQuantity" required>
            </div>
            <div class="form-group">
                <label for="itemPrice">Item Price</label>
                <input type="text" class="form-control itemPrice" readonly>
            </div>
        `;
        itemSection.appendChild(newItem);

        // Add event listeners to new inputs
        const newItemRate = newItem.querySelector('.itemRate');
        const newItemQuantity = newItem.querySelector('.itemQuantity');
        newItemRate.addEventListener('input', function() { calculateItemPrice(newItem); });
        newItemQuantity.addEventListener('input', function() { calculateItemPrice(newItem); });
    }

    // Generate invoice preview
    function generateInvoice() {
        const businessName = document.getElementById('businessName').value;
        const businessAddress = document.getElementById('businessAddress').value;
        const businessNumber = document.getElementById('businessNumber').value;
        const customerName = document.getElementById('customerName').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const customerNumber = document.getElementById('customerNumber').value;

        document.getElementById('outputBusinessName').innerText = businessName;
        document.getElementById('outputBusinessAddress').innerText = businessAddress;
        document.getElementById('outputBusinessNumber').innerText = businessNumber;
        document.getElementById('outputCustomerName').innerText = customerName;
        document.getElementById('outputCustomerAddress').innerText = customerAddress;
        document.getElementById('outputCustomerNumber').innerText = customerNumber;

        // Add items to the preview
        const items = document.querySelectorAll('.item-entry');
        const invoiceItemsTable = document.getElementById('invoiceItemsTable').getElementsByTagName('tbody')[0];
        invoiceItemsTable.innerHTML = '';
        let totalAmount = 0;

        items.forEach(item => {
            const itemName = item.querySelector('.itemName').value;
            const itemRate = parseFloat(item.querySelector('.itemRate').value);
            const itemQuantity = parseInt(item.querySelector('.itemQuantity').value);
            const itemPrice = parseFloat(item.querySelector('.itemPrice').value);

            if (!isNaN(itemPrice)) {
                totalAmount += itemPrice;

                const row = invoiceItemsTable.insertRow();
                row.innerHTML = `
                    <td>${itemName}</td>
                    <td>${itemRate}</td>
                    <td>${itemQuantity}</td>
                    <td>${itemPrice.toFixed(2)}</td>
                `;
            }
        });

        document.getElementById('totalAmount').innerText = totalAmount.toFixed(2);
        document.getElementById('invoiceOutput').style.display = 'block';

        // Recalculate prices when generating invoice
        items.forEach(item => {
            calculateItemPrice(item);
        });
    }

    // Download PDF function
    function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set general font and size
    doc.setFont('helvetica', 'normal');

    // Logo Section
    const logoImg = document.getElementById('logo'); // Assuming there's an image element with id 'logo'
    if (logoImg) {
        const imgData = logoImg.src; // Get base64 data from the logo image
        doc.addImage(imgData, 'PNG', 85, 10, 40, 40); // Center logo at the top
    }

// Business Name and Address
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Fashion Sense', 105, 60, { align: 'center' });

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text(
    'Thana Road, Dhunat, Bogura, Rajshahi, Bangladesh',
    105,
    68,
    { align: 'center' }
);
doc.text('01315807535', 105, 76, { align: 'center' });

// Line after business info
doc.setLineWidth(0.5);
doc.setDrawColor(200, 200, 200);
doc.line(20, 85, 190, 85);

// Customer Information
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Customer Information', 20, 95);

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('Name: ' + document.getElementById('outputCustomerName').innerText, 20, 105);
doc.text('Address: ' + document.getElementById('outputCustomerAddress').innerText, 20, 113);
doc.text('Phone: ' + document.getElementById('outputCustomerNumber').innerText, 20, 121);

// Line after Customer Info
doc.setLineWidth(0.5);
doc.setDrawColor(200, 200, 200);
doc.line(20, 128, 190, 128);

// Item Information Header
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Item Information', 20, 138);

// Table Header with Borders
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
const tableStartY = 145;
const colWidths = [80, 30, 30, 30]; // Width of each column
const colPositions = [20, 100, 130, 160]; // X positions of each column

// Header Row
doc.setFillColor(240, 240, 240); // Light grey background for table header
doc.rect(20, tableStartY, 170, 10, 'F'); // Fill rectangle for the header
doc.setDrawColor(0, 0, 0); // Black borders
doc.rect(20, tableStartY, 170, 10); // Outer border of header row
doc.text('Item', colPositions[0] + 5, tableStartY + 7);
doc.text('Rate', colPositions[1] + 5, tableStartY + 7);
doc.text('Quantity', colPositions[2] + 5, tableStartY + 7);
doc.text('Price', colPositions[3] + 5, tableStartY + 7);

// Table Rows with Borders
let yPosition = tableStartY + 10;
const items = document.querySelectorAll('.item-entry');
doc.setFont('helvetica', 'normal');
items.forEach(item => {
    const itemName = item.querySelector('.itemName').value;
    const itemRate = item.querySelector('.itemRate').value;
    const itemQuantity = item.querySelector('.itemQuantity').value;
    const itemPrice = item.querySelector('.itemPrice').value;

    // Draw horizontal and vertical borders for each cell
    doc.rect(20, yPosition, colWidths[0], 10); // Item column
    doc.rect(100, yPosition, colWidths[1], 10); // Rate column
    doc.rect(130, yPosition, colWidths[2], 10); // Quantity column
    doc.rect(160, yPosition, colWidths[3], 10); // Price column

    // Add text inside each cell
    doc.text(itemName, colPositions[0] + 5, yPosition + 7);
    doc.text(itemRate, colPositions[1] + 5, yPosition + 7);
    doc.text(itemQuantity, colPositions[2] + 5, yPosition + 7);
    doc.text(itemPrice, colPositions[3] + 5, yPosition + 7);
    yPosition += 10;
});

// Total Amount Section with Border
yPosition += 5; // Add some space before the total
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Total Amount:', 20, yPosition);
doc.text(document.getElementById('totalAmount').innerText, 185, yPosition, { align: 'right' });

// Thank You Note
yPosition += 10;
doc.setFontSize(12);
doc.setFont('helvetica', 'italic');
doc.setTextColor(100, 100, 100); // Grey color for the thank-you note
doc.text('Thank you for doing business with us!', 105, yPosition, { align: 'center' });

// Generate a random name for the PDF
const randomFileName = 'invoice_' + Math.random().toString(36).substring(2, 10) + '.pdf';

// Save the PDF with the random name
doc.save(randomFileName);
}
