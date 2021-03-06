﻿// This function is called when any of the tab is clicked
// It is adapted from https://www.w3schools.com/howto/howto_js_tabs.asp

function openInfo(tabName) {

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	// Activates the desired tab button
	document.getElementById(tabName).style.display = "block";
	document.getElementById("btn" + tabName).className += " active";
}



// generate a checkbox list from a list of products
// it makes each product name as the label for the checkbos

function populateListProductChoices(slct2) {
	var s2 = document.getElementById(slct2);

	// s2 represents the <div> in the Products tab, which shows the product list, so we first set it empty
	s2.innerHTML = "";

	//Initialize Empty Product Table
	var productTable = document.createElement("table");
	productTable.id = "productTable";

	var tHeader = document.createElement("tr");
	tHeader.id = "tableHeader"
	var nameHdr = document.createElement("th");
	nameHdr.innerHTML = "Product";
	var priceHdr = document.createElement("th");
	priceHdr.innerHTML = "Price";

	tHeader.appendChild(document.createElement("th", {id: "imageCell"})); //Image Header
	tHeader.appendChild(nameHdr);
	tHeader.appendChild(priceHdr);
	tHeader.appendChild(document.createElement("th")); //Selection Checkbox Header
	productTable.appendChild(tHeader);

	s2.appendChild(productTable);


	// obtain a reduced list of products based on restrictions
	var getVeg = document.getElementById("prefVeg").checked;
	var getGlut = document.getElementById("prefGlut").checked;
	var restrictions = [getVeg, getGlut]

	var optionArray = restrictListProducts(products, restrictions);
	//Order list by price
	optionArray.sort( (a,b) => (a.price >= b.price) ? 1 : -1 );

	//Generate table rows
	/*	<tr id="oddRow/evenRow">
	 *		<td><img src=".." /></td>
	 *		<td>Name</td>
	 *		<td>Price</td>
	 *		<td><input type="checkbox" name="product" value=Name /></td>
	 *	</tr>
	 */
	for (i = 0; i < optionArray.length; i++) {
		var product = optionArray[i];
		
		var newRow = document.createElement("tr");
		newRow.id = (i % 2 == 1) ? "oddRow" : "evenRow";
		//Set id of row to category for filtering
		newRow.className = product.category;

		var imageThumb = document.createElement("img");
		//If i were actually using individual images, I'd just search for 
		//	"Resources/Images/"+ product.name + ".png"
		//instead, but the method stays the same.
		imageThumb.src = "Resources/Images/groceryLogo.png";
		imageThumb.class = "groceryThumbImg";
		var imgThumbWrapper = document.createElement("td");
		imgThumbWrapper.appendChild(imageThumb);
		imgThumbWrapper.id = "imageCell";
		newRow.appendChild(imgThumbWrapper);

		var productName = document.createElement("td");
		productName.innerText = product.name;
		newRow.appendChild(productName);

		var productPrice = document.createElement("td");
		productPrice.innerText = product.price;
		newRow.appendChild(productPrice);

		//Add (hidden) checkbox
		var checkBoxWrapper = document.createElement("td");
		checkBoxWrapper.className = "chkBoxWrapper";
		var checkBox = document.createElement("input");
		checkBox.type = "checkbox";
		checkBox.name = "product";
		checkBox.value = product.name;
		checkBox.id = "chk" + product.name;
		checkBox.style.display = "none";
		checkBoxWrapper.appendChild(checkBox);
		//Add (Add to Cart) button
		var addButton = document.createElement("input");
		addButton.className = "addButton";
		addButton.type = "button";
		addButton.value = "Add Item";
		addButton.name = product.name;
		addButton.onclick = function () { addButtonPressed(this.name); };
		addButton.id = "btn" + product.name;
		checkBoxWrapper.appendChild(addButton);
		newRow.appendChild(checkBoxWrapper);

		productTable.appendChild(newRow);

		//Update parameter in Produce div
		var statusText = ""
		if (getGlut && getVeg) {
			statusText = "<i>Currently only showing Gluten-Free & Vegetarian options!</i>";
		}
		else if (!getGlut && getVeg) {
			statusText = "<i>Currently only showing Vegetarian options!</i>";
		}
		else if (getGlut && !getVeg) {
			statusText = "<i>Currently only showing Gluten-Free options!</i>";
		}
		document.getElementById("restrictions").innerHTML = statusText;
	}
}

function addButtonPressed(productID) {
	//activate hidden checkbox
	document.getElementById("chk" + productID).click();
	//change to Remove button
	document.getElementById("btn" + productID).value = "Remove Item";
	document.getElementById("btn" + productID).onclick = function () { removeButtonPressed(this.name); };
	document.getElementById("btn" + productID).style.opacity = 0.75;
}

function removeButtonPressed(productID) {
	//activate hidden checkbox
	document.getElementById("chk" + productID).click();
	//change to Remove button
	document.getElementById("btn" + productID).value = "Add Item";
	document.getElementById("btn" + productID).onclick = function () { addButtonPressed(this.name); };
	document.getElementById("btn" + productID).style.opacity = 1;
}

// This function is called when the "Add selected items to cart" button in clicked
// The purpose is to build the HTML to be displayed (a Paragraph) 
// We build a paragraph to contain the list of selected items, and the total price

function selectedItems() {

	var ele = document.getElementsByName("product");
	var chosenProducts = [];

	var c = document.getElementById('displayCart');
	c.innerHTML = "";

	// build list of selected item
	var productTable = document.createElement("table");
	productTable.id = "productTable";
	var tHeader = document.createElement("tr");
	tHeader.id = "tableHeader"
	var nameHdr = document.createElement("th");
	nameHdr.innerHTML = "Product";
	tHeader.appendChild(nameHdr);
	productTable.appendChild(tHeader);
	c.appendChild(productTable);

	var j = 1;
	for (i = 0; i < ele.length; i++) {
		if (ele[i].checked) {
			chosenProducts.push(ele[i].value);
			var newRow = document.createElement("tr");
			newRow.id += (j++ % 2 == 1) ? "oddRow" : "evenRow";
			var productName = document.createElement("td");
			productName.innerText = ele[i].value;
			newRow.appendChild(productName);
			productTable.appendChild(newRow);
		}
	}

	c.style = "padding:5px;";
	c.appendChild(document.createElement("br"))
	// add paragraph and total price
	c.appendChild(document.createTextNode("Total Price: $" + getTotalPrice(chosenProducts).toFixed(2)));

}