export default function granitePills(jsonBlock) {
  const id = jsonBlock.id;
  const graniteDiv = document.getElementById(id);
  const o = jsonBlock.options;
  const r = jsonBlock.records;
  const cssId = "#" + id;
  const action = o.addapptation_action || "";
  const formId =
    o.formId || "g__" + Math.random().toString(36).substring(2, 15);
  const method = o.method || "POST";
  const enctype = o.enctype || "application/x-www-form-urlencoded";

  /* ---- Main container ---- */
  const multiSelectForm = document.createElement("form");
  multiSelectForm.classList.add("g__multiselect");
  multiSelectForm.setAttribute("action", action);
  multiSelectForm.setAttribute("id", formId);
  multiSelectForm.setAttribute("method", method);
  multiSelectForm.setAttribute("enctype", enctype);
  multiSelectForm.setAttribute("novalidate", "false");

  const select = document.createElement("select");
  select.multiple = true;
  select.id = `custom-${id}`;
  select.classList.add("g__default-select");
  multiSelectForm.appendChild(select);
  /* ---- Loop through records ---- */

  const customSelect = document.createElement("div");
  customSelect.classList.add("g__custom-select");
  multiSelectForm.appendChild(customSelect);

  r.forEach((r, index) => {
    r.options.forEach((option, index) => {
      const defaultOption = document.createElement("option");
      defaultOption.value = option[0];
      defaultOption.innerText = option[1];

      select.appendChild(defaultOption);

      const customOption = document.createElement("div");
      customOption.setAttribute("data-index", index);
      customOption.classList.add("g__custom-option");

      customOption.innerHTML = option[1];

      customSelect.appendChild(customOption);
    });
  });

  /* ---- Append container to page ---- */
  graniteDiv.appendChild(multiSelectForm);

  const form = document.getElementById(formId);
  const customOptionArr = document.querySelectorAll(".g__custom-option");
  const defaultSelect = document.getElementById(`custom-${id}`);

  if (customOptionArr.length && o.editable) {
    customOptionArr.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.target.classList.toggle("active");
        const icon = e.target.querySelector("i");
        icon.setAttribute("class", "");
        const selected = e.target.dataset.index;
        if (defaultSelect[selected].selected) {
          defaultSelect[selected].selected = false;
          icon.setAttribute("class", "fa fa-thin fa-plus");
        } else {
          defaultSelect[selected].selected = true;
          icon.setAttribute("class", "fa fa-thin fa-check");
        }
      });
    });
  }
}
