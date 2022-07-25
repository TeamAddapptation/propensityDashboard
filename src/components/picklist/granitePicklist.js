export default function granitePicklist(jsonBlock) {
  /*---------------------------------------------
    Global Variables
    ---------------------------------------------*/
  const id = jsonBlock.id;
  const o = jsonBlock.options;
  const r = jsonBlock.records;
  const cssId = "#" + id;
  const granite_div = document.getElementById(id);

  /*---------------------------------------------
    Wrapper
  ---------------------------------------------*/
  const picklistContainer = document.createElement("div");
  picklistContainer.classList.add("g__granite-picklist");

  if (o.label) {
    const filterLabel = document.createElement("label");
    filterLabel.classList.add("g__filter-label");
    filterLabel.innerHTML = o.label;
    picklistContainer.appendChild(filterLabel);
  }

  let filter = document.createElement("select");
  if (o.href_select) {
    filter.setAttribute("onChange", "location = this.value;");
  }
  filter.classList.add("g__elm_select");
  !!o.select_id ? (filter.id = o.select_id) : "";
  !!o.select_id ? (filter.name = o.select_id) : "";
  !!o.classes ? filter.classList.add(o.classes) : "";
  picklistContainer.appendChild(filter);
  if (o.placeholder) {
    const placeholder = document.createElement("option");
    placeholder.selected = true;
    placeholder.disabled = true;
    placeholder.innerHTML = o.placeholder;
    filter.appendChild(placeholder);
  }
  if (o.select_options) {
    o.select_options.forEach((opt) => {
      const option = document.createElement("option");
      let formatValue = opt[0];
      option.setAttribute("value", formatValue);
      option.innerHTML = opt[1];
      filter.appendChild(option);
    });
  }

  /*---------------------------------------------
    Append micro to the DOM
  ---------------------------------------------*/
  granite_div.appendChild(picklistContainer);
}
