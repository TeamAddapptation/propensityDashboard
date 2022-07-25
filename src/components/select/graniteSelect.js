export default function graniteSelect(jsonBlock) {
  const id = jsonBlock.id;
  const o = jsonBlock.options;
  const r = jsonBlock.records;
  const cssId = "#" + id;

  /*---------------------------------------------
    Select Build
    ---------------------------------------------*/
  const selectContainer = document.createElement("div");
  selectContainer.classList.add("g__select-micro-container");

  const select = document.createElement("select");
  o.id ? (select.id = o.id) : "";
  o.classes ? select.setAttribute("class", o.classes) : "";
  o.width ? (select.style.minWidth = o.width) : "";
  select.classList.add("g__select-single");

  if (o.placeholder) {
    const placeholder = document.createElement("option");
    placeholder.selected = true;
    placeholder.disabled = true;
    placeholder.innerText = o.placeholder;
    select.appendChild(placeholder);
  }

  r.forEach((r, index) => {
    const option = document.createElement("option");
    option.value = r.value ? r.value : "value-" + index;
    option.innerText = r.name ? r.name : "Value " + index;
    select.appendChild(option);
  });
  selectContainer.appendChild(select);

  const arrow = document.createElement("div");
  arrow.classList.add("g__select-micro-arrrow");
  arrow.innerHTML = `<i class="far fa-solid fa-angle-down"></i>`;
  selectContainer.appendChild(arrow);

  /*---------------------------------------------
    Append Select DIV
    ---------------------------------------------*/
  if (id) {
    document.getElementById(id).appendChild(selectContainer);
  } else {
    const div = selectContainer.outerHTML;
    return div;
  }
}
