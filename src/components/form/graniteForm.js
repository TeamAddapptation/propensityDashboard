export default function graniteForm(formsBlock) {
  console.log("Form JSON: ", formsBlock);
  const id = formsBlock.id;
  const granite_id = formsBlock.id;
  const o = formsBlock.options;
  const r = formsBlock.records;
  const rLength = r.length;
  const cssId = "#" + id;
  const action = o.addapptation_action || "/";
  const formId = o.formId || "g__" + Math.random().toString(36).substring(2, 15);
  const method = o.method || "POST";
  const enctype = o.enctype || "application/x-www-form-urlencoded";
  const aceFields = [];
  /* -------------------- Check Alignment & Set Mode ----------------------*/
  let granite_div = document.getElementById(id);
  if (granite_div === null) {
    console.error("Object ID and Granite Div ID Do Not Match");
  }
  /* -------------------- CSS ----------------------*/
  var formCss = document.createElement("style");
  formCss.id = "g__css_" + id;
  formCss.innerHTML = `
    ${cssId}{
      width: ${o.width || "100%"};
      max-width:${o.max_width || "100%"};
    }`;
  let granite_css = document.getElementById("g__css_" + id);
  if (granite_css) {
    granite_css.remove();
  }
  document.head.appendChild(formCss);
  /* -------------------- Form Container ----------------------*/
  let formContainer = document.createElement("form");
  // conditional attributes
  formContainer.setAttribute("action", action);
  formContainer.setAttribute("id", formId);
  // static attributes
  formContainer.setAttribute("method", method);
  formContainer.setAttribute("enctype", enctype);
  // formContainer.setAttribute("novalidate", "false");

  const stepIndicator = document.createElement("div");
  stepIndicator.classList.add("g__step-indicator");
  o.edit_form ? stepIndicator.classList.add("g__edit") : "";
  if (o.step_form) {
    formContainer.appendChild(stepIndicator);
  }
  /* -------------------- Call Form Functions ----------------------*/
  const arr_fields = parseRecord(r);
  function parseRecord(r) {
    const formFields = [];
    r.forEach(function (r, index) {
      switch (r.type) {
        case "fieldset":
          const fieldset = document.createElement("fieldset");
          if (r.children) {
            const fieldsetChild = parseRecord(r.children);
            fieldsetChild.forEach((childField) => {
              fieldset.appendChild(childField);
            });
          }
          formFields.push(fieldset);
          break;
        case "inline":
          const container = document.createElement("div");
          container.classList.add("g__inline-fields");
          if (r.class) {
            container.classList.add(r.class);
          }
          if (r.children) {
            const inlineChild = parseRecord(r.children);
            inlineChild.forEach((childField) => {
              container.appendChild(childField);
            });
          }
          formFields.push(container);
          break;
        case "step":
          const progress = document.createElement("div");
          progress.classList.add("g__progress");
          const formStep = document.createElement("div");
          formStep.setAttribute("class", "g__step");
          formStep.style.display = "none";
          r.required ? formStep.classList.add("required-step") : "";
          // Indicator
          const stepName = document.createElement("button");
          stepName.type = "button";
          stepName.classList.add("g__step-name");
          stepName.innerText = r.name || "";
          stepIndicator.appendChild(stepName);
          // Step children
          if (r.children) {
            const stepChild = parseRecord(r.children);
            stepChild.forEach((childField) => {
              formStep.appendChild(childField);
            });
          }
          formFields.push(formStep);
          break;
        default:
          const field = buildRecord(r, index);
          if (!!field) {
            formFields.push(field);
          }
      }
    });
    return formFields;
  }

  // Push formFields array to formContainer
  arr_fields.forEach((field) => {
    formContainer.appendChild(field);
  });

  /* -------------------- Labels and Info ----------------------*/
  function addLabels(field_info_container, r) {
    //Global labels and character counter
    if (!!r.title) {
      const label = document.createElement("label");
      String(r.required) === "true" ? label.classList.add("required") : "";
      label.setAttribute("for", r.name);
      label.innerHTML = r.title;
      field_info_container.appendChild(label);
    }
    return field_info_container;
  }
  /* -------------------- Standard Field Attributes ----------------------*/
  function basicAttributes(r, input, class_name) {
    input.setAttribute("class", class_name);
    !!r.type ? input.setAttribute("type", r.type) : "";
    !!formId ? input.setAttribute("form_id", formId) : "";
    !!r.name ? input.setAttribute("name", r.name) : "";
    !!r.value ? input.setAttribute("value", r.value) : input.setAttribute("value", "");
    !!r.title ? input.setAttribute("title", r.title) : "";
    !!r.placeholder ? input.setAttribute("placeholder", r.placeholder) : "";
    parseInt(r.length) > 0 ? input.setAttribute("maxlength", r.length) : "";
    !!r.invalid_message ? input.setAttribute("oninvalid", `this.setCustomValidity("${r.invalid_message}")`) : "";
    input.required = r.required;
    String(r.disabled) === "true" ? (input.disabled = true) : (input.disabled = false);
    return input;
  }
  /* -------------------- Hidden Fields ----------------------*/
  function hiddenFields(hidden, name, value) {
    hidden.setAttribute("type", "hidden");
    hidden.setAttribute("name", name);
    hidden.setAttribute("form_id", formId);
    hidden.setAttribute("value", value);
    return hidden;
  }
  /* -------------------- Form Field ----------------------*/
  function buildRecord(r, num) {
    const error_field = document.createElement("div");
    error_field.setAttribute("class", "g__error_msg");

    r.id = !!r.id ? r.id : "a__" + Math.random().toString(36).substring(2, 15);
    const class_name = "g__field-" + r.type;

    let field_info_container;
    let form_field;
    if (r.type != "subheader" && r.type != "description" && r.type != "hidden" && r.type != "divider") {
      form_field = document.createElement("div");
      form_field.setAttribute("class", "g__form_field");
      !!r.field_max_width ? (form_field.style.maxWidth = r.field_max_width) : "";
      form_field.setAttribute("data-micro-id", id);
      !!r.addapptation_id ? form_field.setAttribute("data-record-id", r.addapptation_id) : "";
      !!r.classes ? form_field.classList.add(r.classes) : "";
      String(r.disabled) === "true" ? form_field.classList.add("g__disabled") : "";

      field_info_container = document.createElement("div");
      field_info_container.setAttribute("class", "g__field_info");
    } else if (r.type === "hidden") {
      form_field = document.createElement("div");
      form_field.setAttribute("class", "g__hidden_field");
    }

    //build each field depending on the type
    let input;
    switch (r.type) {
      case "ace":
        const aceId = `g__ace-${num}`;
        aceFields.push(aceId);
        const aceContainer = document.createElement("div");
        aceContainer.id = aceId;
        aceContainer.innerText = r.value;
        const editor = ace.edit(aceContainer);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/ruby");
        editor.setOptions({
          selectionStyle: "line", // 'line'|'text'
          highlightActiveLine: true, // boolean
          highlightSelectedWord: true, // boolean
          readOnly: false, // boolean: true if read only
          cursorStyle: "ace", // 'ace'|'slim'|'smooth'|'wide'
          mergeUndoDeltas: true, // false|true|'always'
          behavioursEnabled: true, // boolean: true if enable custom behaviours
          wrapBehavioursEnabled: true, // boolean
          //autoScrollEditorIntoView: undefined, // boolean: this is needed if editor is inside scrollable page
          autoScrollEditorIntoView: true,
          keyboardHandler: null, // function: handle custom keyboard events

          // RENDERER OPTIONS
          animatedScroll: false, // boolean: true if scroll should be animated
          displayIndentGuides: false, // boolean: true if the indent should be shown. See 'showInvisibles'
          showInvisibles: false, // boolean -> displayIndentGuides: true if show the invisible tabs/spaces in indents
          showPrintMargin: true, // boolean: true if show the vertical print margin
          printMarginColumn: 80, // number: number of columns for vertical print margin
          printMargin: undefined, // boolean | number: showPrintMargin | printMarginColumn
          showGutter: true, // boolean: true if show line gutter
          fadeFoldWidgets: false, // boolean: true if the fold lines should be faded
          showFoldWidgets: false, // boolean: true if the fold lines should be shown ?
          showLineNumbers: true,
          highlightGutterLine: true, // boolean: true if the gutter line should be highlighted
          hScrollBarAlwaysVisible: false, // boolean: true if the horizontal scroll bar should be shown regardless
          vScrollBarAlwaysVisible: true, // boolean: true if the vertical scroll bar should be shown regardless
          fontSize: 14, // number | string: set the font size to this many pixels
          fontFamily: undefined, // string: set the font-family css value
          maxLines: 30, // number: set the maximum lines possible. This will make the editor height changes 40
          minLines: 30, // number: set the minimum lines possible. This will make the editor height changes
          maxPixelHeight: 2000, // number -> maxLines: set the maximum height in pixel, when 'maxLines' is defined.
          //scrollPastEnd: 0.05, // number -> !maxLines: if positive, user can scroll pass the last line and go n * editorHeight more distance
          fixedWidthGutter: false, // boolean: true if the gutter should be fixed width
          //  theme: 'ace/theme/textmate', // theme string from ace/theme or custom?

          // MOUSEHANDLER OPTIONS
          scrollSpeed: 2, // number: the scroll speed index
          dragDelay: 0, // number: the drag delay before drag starts. it's 150ms for mac by default
          dragEnabled: true, // boolean: enable dragging
          focusTimeout: 0, // number: the focus delay before focus starts.
          tooltipFollowsMouse: true, // boolean: true if the gutter tooltip should follow mouse

          // SESSION OPTIONS
          firstLineNumber: 1, // number: the line number in first line
          overwrite: false, // boolean
          newLineMode: "auto", // 'auto' | 'unix' | 'windows'
          useWorker: true, // boolean: true if use web worker for loading scripts
          useSoftTabs: true, // boolean: true if we want to use spaces than tabs
          tabSize: 2, // number
          wrap: false, // boolean | string | number: true/'free' means wrap instead of horizontal scroll, false/'off' means horizontal scroll instead of wrap, and number means number of column before wrap. -1 means wrap at print margin
          indentedSoftWrap: true, // boolean
          foldStyle: "markbegin",
        });
        form_field.appendChild(aceContainer);
        break;
      case "boolean":
      case "checkbox":
        let check_container = document.createElement("div");

        let label = document.createElement("label");
        label.classList.add("g__filter-label");
        label.setAttribute("for", r.id);
        label.innerHTML = r.title;
        String(r.required) === "true" ? (label.innerHTML += "*") : "";
        check_container.appendChild(label);

        String(r.switch) === "true" ? check_container.setAttribute("class", "g__check-container-switch") : check_container.setAttribute("class", "g__check-container");
        input = document.createElement("input");
        r.g_type === "boolean" ? (r.g_type = "checkbox") : "";
        input.setAttribute("class", class_name);
        input.setAttribute("id", r.id);
        input.setAttribute("type", r.type);
        input.setAttribute("form_id", formId);
        input.setAttribute("name", r.name);
        input.setAttribute("title", r.title);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        console.log("Checkbox Value: ", r);
        String(r.value) === "true" ? input.setAttribute("value", r.value) : input.setAttribute("value", "false");
        String(r.value) === "true" ? (input.checked = true) : (input.checked = false);
        String(r.value) === "true" ? input.classList.add("g__checked") : input.classList.add("g__unchecked");
        input.required = String(r.required) === "true";
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        label.appendChild(input);

        const styledCheckbox = document.createElement("div");
        styledCheckbox.classList.add("g__styled-checkbox");
        label.appendChild(styledCheckbox);

        if (String(r.switch) === "true") {
          let slider = document.createElement("span");
          slider.classList.add("g__slider");
          check_container.appendChild(slider);
        }

        form_field.appendChild(check_container);
        form_field.appendChild(error_field);
        break;
        break;
      case "color":
        form_field.appendChild(addLabels(field_info_container, r));
        let color_container = document.createElement("div");
        color_container.setAttribute("class", "g__color-container");
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        input.setAttribute("pattern", "^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$");
        var hex_display = document.createElement("input");
        hex_display.type = "text";
        hex_display.setAttribute("class", "g__hex-value");
        let color_value = !!r.value ? r.value : "#ffffff";
        hex_display.setAttribute("value", color_value);
        !!r.name ? hex_display.setAttribute("data-attr", r.name) : "";
        String(r.disabled) === "true" ? (hex_display.disabled = true) : "";
        hex_display.setAttribute("pattern", "^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$");
        color_container.appendChild(input);
        color_container.appendChild(hex_display);
        form_field.appendChild(color_container);
        form_field.appendChild(error_field);
        break;
      case "currency":
        form_field.appendChild(addLabels(field_info_container, r));
        let curr_container = document.createElement("div");
        curr_container.setAttribute("class", "g__currency-container");
        r.show_stepper_arrow ? curr_container.classList.add("g__show-counter") : curr_container.classList.add("g__hide-counter");
        let curr_format = document.createElement("div");
        curr_format.setAttribute("class", "g__currency-unit");
        curr_format.innerHTML = r.curr_format || "$";
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        r.type = "number";
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        input.inputmode = "decimal";
        !!r.max_number ? (input.max = r.max_number) : "";
        !!r.min_number ? (input.min = r.min_number) : "";
        !!r.step ? (input.step = r.step) : "";
        !!r.pattern ? input.setAttribute("pattern", r.pattern) : "";
        //Increase decrease container
        let curr_counter = document.createElement("div");
        curr_counter.setAttribute("class", "g__number-plus-minus");
        // Increase container
        let curr_increase = document.createElement("div");
        curr_increase.setAttribute("class", "g__number-increase");
        curr_counter.appendChild(curr_increase);
        // Decrease container
        let curr_decrease = document.createElement("div");
        curr_decrease.setAttribute("class", "g__number-decrease");
        curr_counter.appendChild(curr_decrease);
        //Append the parent elements
        curr_container.appendChild(curr_format);
        curr_container.appendChild(input);
        curr_container.appendChild(curr_counter);
        form_field.appendChild(curr_container);
        form_field.appendChild(error_field);
        break;
      case "custom":
        form_field.appendChild(addLabels(field_info_container, r));
        let customContainer = document.createElement("div");
        customContainer.setAttribute("class", "g__custom_container");
        const customFunction = r.custom_function;
        customContainer.appendChild(customFunction);
        form_field.appendChild(customContainer);
        break;
      case "date":
        form_field.appendChild(addLabels(field_info_container, r));
        let date_container = document.createElement("div");
        date_container.setAttribute("class", "g__date_container");
        input = document.createElement("input");
        input.setAttribute("type", "date");
        input.setAttribute("class", "g__date_field");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        !!formId ? input.setAttribute("form_id", formId) : "";
        !!r.name ? input.setAttribute("name", r.name) : "";
        !!r.value ? input.setAttribute("value", r.value) : "";
        !!r.placeholder ? input.setAttribute("placeholder", r.placeholder) : "";
        input.required = r.required;
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        String(r.disabled) === "true" ? (input.disabled = true) : "";
        input.autocomplete = "false";
        let date_icon = document.createElement("div");
        date_icon.setAttribute("class", "g__calendar_icon");
        date_icon.innerHTML = "<i class='fal fa-calendar-alt'></i>";
        date_icon.style.display = "none";
        date_container.appendChild(input);
        date_container.appendChild(date_icon);
        form_field.appendChild(date_container);
        form_field.appendChild(error_field);
        break;
      case "divider":
        form_field = document.createElement("div");
        form_field.classList.add("g__form_divider");
        break;
      case "description":
        form_field = document.createElement("p");
        form_field.setAttribute("data-micro-id", id);
        !!r.addapptation_id ? form_field.setAttribute("data-record-id", r.addapptation_id) : "";
        form_field.setAttribute("class", "g__form-description");
        r.classes ? form_field.classList.add(r.classes) : "";
        form_field.innerHTML = r.value || "Description";
        break;
      case "email":
        form_field.appendChild(addLabels(field_info_container, r));
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        !!r.pattern ? input.setAttribute("pattern", r.pattern) : "";
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        form_field.appendChild(input);
        form_field.appendChild(error_field);
        break;
      case "file":
        form_field.appendChild(addLabels(field_info_container, r));
        let file_container = document.createElement("div");
        file_container.setAttribute("class", "g__file-container");
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        !!r.accepted_file_types ? input.setAttribute("accept", r.accepted_file_types) : "";
        r.multiple ? input.setAttribute("multiple", "true") : "";
        input.setAttribute("hidden", "hidden");
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        let file_btn = document.createElement("button");
        file_btn.setAttribute("type", "button");
        file_btn.setAttribute("class", "g__file-btn");
        file_btn.innerText = "Choose File";
        let file_text = document.createElement("div");
        file_text.setAttribute("class", "g__file-text");
        file_text.innerText = r.placeholder || "No file chosen, yet.";
        file_container.appendChild(input);
        file_container.appendChild(file_btn);
        file_container.appendChild(file_text);
        form_field.appendChild(file_container);
        form_field.appendChild(error_field);
        break;
      case "hidden":
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        basicAttributes(r, input, class_name);
        form_field.appendChild(input);
        break;
      case "multi":
      case "multiselect":
        form_field.appendChild(addLabels(field_info_container, r));
        let multi_container = document.createElement("div");
        multi_container.setAttribute("class", "g__multi_container");
        let multi_options = r.options;
        let multi_double_arr = Array.isArray(multi_options) && Array.isArray(multi_options[0]);
        let multi_select = document.createElement("select");
        !!r.name ? multi_select.setAttribute("data-attr", r.name) : "";
        multi_select.setAttribute("multiple", "multiple");
        String(r.required) === "true" ? multi_select.classList.add("g__required") : "";
        if (multi_double_arr) {
          for (let i = 0; i < multi_options.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", multi_options[i][0]);
            option.innerHTML = multi_options[i][1];
            multi_select.appendChild(option);
          }
        } else {
          for (let i = 0; i < multi_options.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", multi_options[i]);
            option.innerHTML = multi_options[i];
            multi_select.appendChild(option);
          }
        }
        multi_container.appendChild(multi_select);
        form_field.appendChild(multi_container);
        break;
      case "number":
        form_field.appendChild(addLabels(field_info_container, r));
        let num_container = document.createElement("div");
        num_container.setAttribute("class", "g__number_container");
        String(r.show_stepper_arrow === "true") ? num_container.classList.add("g__show_counter") : num_container.classList.add("g__hide_counter");
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        !!r.max_number ? (input.max = r.max_number) : "";
        !!r.min_number ? (input.min = r.min_number) : "";
        !!r.step ? (input.step = r.step) : "";
        !!r.pattern ? input.setAttribute("pattern", r.pattern) : "";
        if (!!r.num_unit) {
          let unit = document.createElement("div");
          unit.classList.add("g__num_unit");
          unit.innerHTML = r.num_unit;
          num_container.appendChild(unit);
        }
        // Increase decrease container
        let num_counter = document.createElement("div");
        num_counter.setAttribute("class", "g__number_plus_minus");
        // Increase container
        let num_increase = document.createElement("div");
        num_increase.setAttribute("class", "g__number_increase");
        !!r.name ? num_increase.setAttribute("data-attr", r.name) : "";
        num_counter.appendChild(num_increase);
        // Decrease container
        let num_decrease = document.createElement("div");
        num_decrease.setAttribute("class", "g__number_decrease");
        !!r.name ? num_decrease.setAttribute("data-attr", r.name) : "";
        num_counter.appendChild(num_decrease);
        //Append the parent elements
        num_container.appendChild(input);
        num_container.appendChild(num_counter);
        form_field.appendChild(num_container);
        form_field.appendChild(error_field);
        break;
      case "password":
        form_field.appendChild(addLabels(field_info_container, r));
        let pass_container = document.createElement("div");
        pass_container.setAttribute("class", "g__password-container");
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        !!r.pattern ? input.setAttribute("pattern", r.pattern) : "";
        let pass_show = document.createElement("div");
        pass_show.setAttribute("class", "g__password-show");
        r.showPassword_option ? "" : pass_show.classList.add("g__hide-password-btn");
        pass_show.innerHTML = '<i class="far fa-eye"></i>';
        pass_container.appendChild(input);
        pass_container.appendChild(pass_show);
        form_field.appendChild(pass_container);
        form_field.appendChild(error_field);
        break;
      case "picklist":
        form_field.appendChild(addLabels(field_info_container, r));
        let picklist_options = !!r.options ? r.options : ["option 1", "option 2"];
        let picklist_double_arr = Array.isArray(picklist_options) && Array.isArray(picklist_options[0]);
        input = document.createElement("div");
        if (String(r.multiple) === "true") {
          input.setAttribute("multiple", "true");
          input.classList.add("g__picklist_multiple");
        }
        input.classList.add("g__picklist");
        String(o.default_picklists) === "true" ? input.classList.add("g__default_picklist") : input.classList.add("g__custom_picklist");
        String(r.picklist_search) === "true" ? input.classList.add("g__search") : "";
        let select = document.createElement("select");
        !!r.name ? select.setAttribute("data-attr", r.name) : "";
        select.setAttribute("class", class_name);
        !!r.type ? select.setAttribute("type", r.type) : "";
        !!formId ? select.setAttribute("form_id", formId) : "";
        !!r.name ? select.setAttribute("name", r.name) : "";
        !!r.title ? select.setAttribute("title", r.title) : "";
        if (r.placeholder && r.multiple) {
          select.setAttribute("data-placeholder", r.placeholder);
        } else if (r.placeholder) {
          select.setAttribute("placeholder", r.placeholder);
        }
        select.required = r.required;
        String(r.disabled) === "true" ? (select.disabled = true) : (select.disabled = false);
        String(r.required) === "true" ? select.classList.add("g__required") : "";
        select.setAttribute("id", r.id);
        String(r.multiple) === "true" ? select.classList.add("g__select_multiple") : select.classList.add("g__select_default");

        if (String(r.multiple) === "true") {
          select.setAttribute("multiple", "multiple");
        }
        if (String(o.default_picklists) === "true" && r.placeholder) {
          let option_placeholder = document.createElement("option");
          option_placeholder.disabled = true;
          option_placeholder.selected = true;
          option_placeholder.hidden = true;
          option_placeholder.innerHTML = r.placeholder;
          select.appendChild(option_placeholder);
        }
        if (picklist_double_arr) {
          for (let i = 0; i < picklist_options.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", picklist_options[i][0]);
            if (r.value === picklist_options[i][0]) {
              option.selected = true;
            }
            option.innerHTML = picklist_options[i][1];
            select.appendChild(option);
          }
        } else {
          for (let i = 0; i < picklist_options.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", picklist_options[i]);
            if (r.value === picklist_options[i]) {
              option.selected = true;
            }
            option.innerHTML = picklist_options[i];
            select.appendChild(option);
          }
        }

        input.appendChild(select);
        form_field.appendChild(input);
        form_field.appendChild(error_field);
        break;
      case "radio":
        form_field.appendChild(addLabels(field_info_container, r));
        let radio_options = !!r.options ? r.options : ["Radio 1", "Radio 2"];
        let is_array = Array.isArray(radio_options);
        if (!is_array) {
          let arr_options = radio_options.split(",");
          radio_options = arr_options;
        }
        let is_double_array = Array.isArray(radio_options) && Array.isArray(radio_options[0]);
        let radio_container = document.createElement("div");
        radio_container.setAttribute("class", "g__radio-container");
        r.radio_style === "button" ? radio_container.classList.add("g__radio-btn") : "";
        radio_container.id = r.id;
        for (let i = 0; i < radio_options.length; i++) {
          let input_container = document.createElement("div");
          input_container.setAttribute("class", "g__radio-option");
          input = document.createElement("input");
          input.setAttribute("class", "g__field-radio");
          !!r.name ? input.setAttribute("data-attr", r.name) : "";
          !!formId ? input.setAttribute("form_id", formId) : "";
          String(r.next_on_click) === "true"
            ? input.addEventListener("click", () => {
                nextPrev(currStep);
              })
            : "";
          input.type = "radio";
          input.name = r.name;
          input.required = r.required;
          String(r.required) ? input.classList.add("g__required") : "";
          String(r.disabled) === "true" ? (input.disabled = "true") : "";
          let radio_label = document.createElement("label");
          radio_label.setAttribute("class", "g__radio-label");
          if (is_double_array) {
            input.id = radio_options[i][0];
            input.value = radio_options[i][0];
            r.value === radio_options[i][0] ? input.setAttribute("checked", "true") : "";
            radio_label.id = radio_options[i][0];
            radio_label.setAttribute("for", radio_options[i][0]);
            radio_label.innerHTML = radio_options[i][1];
          } else {
            let cleanId = radio_options[i].replace(/ /g, "");
            input.id = cleanId;
            input.value = radio_options[i];
            r.value === radio_options[i] ? input.setAttribute("checked", "true") : "";
            radio_label.id = cleanId;
            radio_label.setAttribute("for", cleanId);
            radio_label.innerHTML = radio_options[i];
            if (r.description) {
              radio_label.innerHTML += r.description[i];
            }
          }
          input_container.appendChild(input);
          if (String(r.radio_style) != "button") {
            let radio = document.createElement("div");
            radio.setAttribute("class", "g__radio");
            input_container.appendChild(radio);
          }
          input_container.appendChild(radio_label);
          radio_container.appendChild(input_container);
        }
        form_field.appendChild(radio_container);
        form_field.appendChild(error_field);
        break;
      case "range":
        form_field.appendChild(addLabels(field_info_container, r));
        let min = r.min_number || 0;
        let max = r.max_number || 100;
        let range_container = document.createElement("div");
        range_container.setAttribute("class", "g__range-container");
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        input.setAttribute("min", min);
        input.setAttribute("max", max);
        basicAttributes(r, input, class_name);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        let output = document.createElement("input");
        String(r.disabled) === "true" ? (output.disabled = true) : "";
        output.setAttribute("class", "g__range-output");
        output.setAttribute("type", "number");
        !!r.value ? output.setAttribute("value", r.value) : "";
        !!r.name ? output.setAttribute("data-attr", r.name) : "";
        // Unit indicator
        let unit = document.createElement("div");
        unit.setAttribute("class", "g__range-unit");
        unit.innerHTML = r.range_unit || "px";
        // Increase decrease container
        let plusMinus = document.createElement("div");
        plusMinus.setAttribute("class", "g__range_plus_minus");
        // Increase container
        let increase = document.createElement("div");
        increase.setAttribute("class", "g__range-increase");
        !!r.name ? increase.setAttribute("data-attr", r.name) : "";
        plusMinus.appendChild(increase);
        // Decrease container
        let decrease = document.createElement("div");
        decrease.setAttribute("class", "g__range-decrease");
        !!r.name ? decrease.setAttribute("data-attr", r.name) : "";
        plusMinus.appendChild(decrease);
        //Append the parent elements
        range_container.appendChild(input);
        range_container.appendChild(output);
        range_container.appendChild(unit);
        range_container.appendChild(plusMinus);
        form_field.appendChild(error_field);
        form_field.appendChild(range_container);
        break;
      case "spacing":
        form_field.appendChild(addLabels(field_info_container, r));
        const spacing_arr = ["top", "link", "bottom", "left", "link", "right"];
        const spacing_container = document.createElement("div");
        spacing_container.setAttribute("class", "g__spacing_container");
        //Desktop hidden field
        const hidden_desktop = document.createElement("input");
        hidden_desktop.setAttribute("class", "g__space_desktop_hidden");
        hidden_desktop.type = "hidden";
        !!formId ? hidden_desktop.setAttribute("form_id", formId) : "";
        !!r.name ? (hidden_desktop.name = r.name) : "";
        !!r.title ? (hidden_desktop.title = r.title) : "";
        spacing_container.appendChild(hidden_desktop);
        //mobile hidden field
        const hidden_mobile = document.createElement("input");
        hidden_mobile.setAttribute("class", "g__space_desktop_hidden");
        hidden_mobile.type = "hidden";
        !!formId ? hidden_mobile.setAttribute("form_id", formId) : "";
        !!r.name ? (hidden_mobile.name = r.name) : "";
        !!r.title ? (hidden_mobile.title = r.title) : "";
        spacing_container.appendChild(hidden_mobile);
        spacing_arr.forEach((val, num) => {
          if (val === "link") {
            let field_container = document.createElement("div");
            num === 1 ? field_container.setAttribute("class", `g__link g__link_tb`) : field_container.setAttribute("class", `g__link g__link_lr`);
            spacing_container.appendChild(field_container);
            let link = document.createElement("div");
            link.setAttribute("class", "g__space_link");
            link.innerHTML = '<i class="far fa-link"></i>';
            field_container.appendChild(link);
            form_field.appendChild(spacing_container);
          } else {
            let field_container = document.createElement("div");
            field_container.setAttribute("class", `g__space_field g__${val}`);
            spacing_container.appendChild(field_container);
            let input = document.createElement("input");
            input.type = "text";
            input.setAttribute("class", `g__input_${val}`);
            input.setAttribute("data-side", `${val}`);
            field_container.appendChild(input);
            let label = document.createElement("p");
            label.setAttribute("class", `g__label_${val}`);
            label.innerHTML = val;
            field_container.appendChild(label);
            form_field.appendChild(spacing_container);
          }
        });
        break;
      case "header":
      case "subheader":
        form_field = document.createElement("h2");
        form_field.setAttribute("class", "g__form-header");
        form_field.setAttribute("data-micro-id", id);
        form_field.setAttribute("type", "header");
        r.name ? form_field.setAttribute("data-attr", r.name) : "";
        r.classes ? form_field.classList.add(r.classes) : "";
        !!r.addapptation_id ? form_field.setAttribute("data-record-id", r.addapptation_id) : "";
        form_field.innerHTML = r.value || "Heading";
        break;
      case "tags":
        form_field.appendChild(addLabels(field_info_container, r));
        const tagContainer = document.createElement("div");
        tagContainer.classList.add("g__tag-container");
        form_field.appendChild(tagContainer);
        input = document.createElement("input");
        input.classList.add("g__tag-input");
        input.type = "text";
        const hiddenInput = document.createElement("input");
        basicAttributes(r, hiddenInput, class_name);
        hiddenInput.setAttribute("id", r.id);
        hiddenInput.type = "hidden";
        hiddenInput.classList.add("g__tag-hidden-values");
        tagContainer.appendChild(input);
        tagContainer.appendChild(hiddenInput);
        form_field.appendChild(error_field);
        break;
      case "tel":
        form_field.appendChild(addLabels(field_info_container, r));
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        basicAttributes(r, input, class_name);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        input.setAttribute("form", formId);
        form_field.appendChild(input);
        form_field.appendChild(error_field);
        break;
      case "textarea":
        form_field.appendChild(addLabels(field_info_container, r));
        input = document.createElement("textarea");
        input.setAttribute("id", r.id);
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        input.innerHTML = r.value || "";
        input.rows = r.rows || "4";
        input.setAttribute("cols", "50");
        input.setAttribute("form", formId);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        form_field.appendChild(input);
        form_field.appendChild(error_field);
        break;
      case "quill":
        form_field.appendChild(addLabels(field_info_container, r));
        let quil = document.createElement("div");
        quil.setAttribute("class", "g__quil_editor");
        let quill_id = "quill_" + num;
        quil.setAttribute("id", quill_id);
        input = document.createElement("input");
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        input.setAttribute("id", quill_id);
        basicAttributes(r, input, class_name);
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        input.setAttribute("type", "hidden");
        form_field.appendChild(quil);
        form_field.appendChild(input);
        form_field.appendChild(error_field);
        break;
      default:
        form_field.appendChild(addLabels(field_info_container, r));
        input = document.createElement("input");
        input.setAttribute("id", r.id);
        basicAttributes(r, input, class_name);
        !!r.name ? input.setAttribute("data-attr", r.name) : "";
        String(r.required) === "true" ? input.classList.add("g__required") : "";
        form_field.appendChild(input);
        form_field.appendChild(error_field);
    }
    return form_field;
  }
  /* -------------------- Hidden Option Fields ----------------------*/
  if (!!o.db_id || !!o.db_object || !!o.db_action || !!o.db_redirect) {
    let hidden_container = document.createElement("div");
    hidden_container.classList.add("g__hidden_field");
    if (!!o.db_id) {
      let hidden_db = document.createElement("input");
      hiddenFields(hidden_db, "Id", o.db_id);
      hidden_container.appendChild(hidden_db);
      formContainer.appendChild(hidden_container);
    }
    if (!!o.db_object) {
      let hidden_object = document.createElement("input");
      hiddenFields(hidden_object, "object", o.db_object);
      hidden_container.appendChild(hidden_object);
      formContainer.appendChild(hidden_container);
    }
    if (!!o.db_action) {
      let hidden_action = document.createElement("input");
      hiddenFields(hidden_action, "submit_form", o.db_action);
      hidden_container.appendChild(hidden_action);
      formContainer.appendChild(hidden_container);
    }
    if (!!o.db_redirect) {
      let hidden_redirect = document.createElement("input");
      hiddenFields(hidden_redirect, "redirect_to", o.db_redirect);
      hidden_container.appendChild(hidden_redirect);
      formContainer.appendChild(hidden_container);
    }
    if (!!o.flash_message) {
      let hidden_flash = document.createElement("input");
      hiddenFields(hidden_flash, "flash_message", o.flash_message);
      hidden_container.appendChild(hidden_flash);
      formContainer.appendChild(hidden_container);
    }
  }
  document.getElementById(granite_id).appendChild(formContainer);

  /* -------------------- Submit Cancel ----------------------*/
  if (!o.step_form) {
    let button_container = document.createElement("div");
    button_container.id = "g__submit_cancel";
    button_container.setAttribute("class", "g__button_container");
    // Submit & Cancel Button
    if (o.submit_btn) {
      let submit = document.createElement("button");
      submit.setAttribute("id", "g__submit_btn");
      submit.setAttribute("type", "submit");
      o.submit_classes ? submit.setAttribute("class", o.submit_classes) : "";
      o.show_loader ? submit.classList.add("show_loader") : "";
      submit.innerHTML = o.submit_label || "Submit";
      button_container.appendChild(submit);
    }

    if (o.cancel_btn) {
      let cancel = document.createElement("button");
      o.cancel_classes ? cancel.setAttribute("class", o.cancel_classes) : "";
      cancel.setAttribute("id", "g__cancel_btn");
      cancel.setAttribute("type", "button");
      cancel.innerHTML = o.cancel_label;
      button_container.appendChild(cancel);
    }

    formContainer.appendChild(button_container);
  }
  /* -------------------- Picklist Multi ----------------------*/
  let multiple_field = document.getElementsByClassName("g__select_multiple");
  if (multiple_field.length > 0) {
    $(".g__select_multiple").chosen({
      width: "auto",
    });
  }

  /* -------------------- Dep Fields ----------------------*/

  depCheck(r);
  function depCheck(r) {
    r.forEach((r) => {
      switch (r.type) {
        case "fieldset":
        case "inline":
        case "step":
          if (r.children) {
            depCheck(r.children);
          }
          break;
        default:
          if (r.dep_parent) {
            const child = document.getElementById(r.id);
            const childContainer = child.closest(".g__form_field");
            const parent = document.getElementById(r.dep_parent);
            childContainer.style.visibility = "hidden";
            childContainer.style.display = "none";
            depHandler(parent.value);
            parent.addEventListener("change", (e) => {
              depHandler(e.target.value);
            });
            function depHandler(value) {
              if (value === r.dep_value) {
                childContainer.style.display = "block";
                childContainer.style.visibility = "visible";
                childContainer.style.height = "auto";
              } else {
                childContainer.style.display = "none";
                childContainer.style.visibility = "hidden";
                childContainer.style.height = 0;
              }
            }
          }
      }
    });
  }
  /* -------------------- Form steps ----------------------*/
  if (o.step_form) {
    const nextPrev = document.createElement("div");
    nextPrev.classList.add("g__next-prev-step");

    const prev = document.createElement("button");
    prev.classList.add("g__prev-btn");
    prev.type = "button";
    prev.id = "g__prev";
    prev.innerText = "Back";
    prev.addEventListener("click", () => nextPrevClick(-1));
    nextPrev.appendChild(prev);

    const next = document.createElement("button");
    next.classList.add("g__next-btn");
    next.type = "button";
    next.id = "g__next";
    next.innerText = "Continue";
    next.addEventListener("click", () => nextPrevClick(1));
    nextPrev.appendChild(next);

    formContainer.appendChild(nextPrev);

    let currentStep = 0;
    const stepsNode = document.querySelectorAll(".g__step");
    const stepsArr = Array.from(stepsNode);

    function showTab(stepNum) {
      stepsArr[currentStep].style.display = "grid";
      if (o.edit_form) {
        prev.style.display = "none";
        next.innerText = "Save";
      } else {
        stepNum == 0 ? (prev.style.display = "none") : (prev.style.display = "inline-block");
        currentStep == stepsArr.length - 1 ? (next.innerHTML = "See My Score <i class='far far-solid fa-arrow-right'></i>") : (next.innerText = "Continue");
      }
      activeStep(currentStep);
    }
    showTab(currentStep);

    function activeStep(num) {
      const stepNames = document.querySelectorAll(".g__step-name");
      const stepNamesArr = Array.from(stepNames);
      stepNamesArr.forEach((step) => {
        if (step.classList.contains("active")) {
          step.classList.remove("active");
        }
      });
      stepNamesArr[num].className += " active";
      if (num != 0) {
        stepNamesArr[num].scrollIntoView();
      }
    }

    const stepNames = document.querySelectorAll(".g__step-name");
    const stepNamesArr = Array.from(stepNames);
    stepNamesArr.forEach((step, index) => {
      step.addEventListener("click", () => {
        stepsArr[currentStep].style.display = "none";
        currentStep = index;
        showTab(currentStep);
        activeStep(currentStep);
      });
    });

    function nextPrevClick(num) {
      if (o.edit_form) {
        validate(true, stepsArr[currentStep]);
        return false;
      }

      if (currentStep < stepsArr.length) {
        if (validate(true, stepsArr[currentStep], true, num)) {
          showTab(num);
          activeStep(currentStep);
        } else {
          return false;
        }
      }

      stepsArr[currentStep].style.display = "none";
      currentStep = currentStep + num;
      if (currentStep >= stepsArr.length) {
        validate(false, false, false);
        return false;
      }

      showTab(num);
      activeStep(currentStep);
    }
  }

  function validate(step, stepIndex, isMidStep = false, num) {
    if (num === -1) {
      return;
    }
    let all_field_containers;
    if (step) {
      all_field_containers = stepIndex.querySelectorAll(".g__form_field");
    } else {
      all_field_containers = document.querySelectorAll(".g__form_field");
    }
    let errors_arr = [];
    all_field_containers.forEach((field) => {
      let input = field.querySelector(`input[form_id="${formId}"]`);
      let textarea = field.querySelector(`textarea[form_id="${formId}"]`);
      let select = field.querySelector(`select[form_id="${formId}"]`);
      let error_msg = field.querySelector(".g__error_msg");
      let is_quill, is_required;
      if (!!input) {
        is_quill = input.classList.contains("g__field_quill");
        is_required = input.required;
      }
      if (!!input && input.type != "hidden") {
        if (!input.checkValidity()) {
          input.classList.remove("valid");
          input.classList.add("invalid");
          errors_arr.push(input);
          error_msg.classList.add("active");
          error_msg.innerHTML = input.validationMessage;
        } else {
          input.classList.add("valid");
          input.classList.remove("invalid");
          error_msg.classList.remove("active");
        }
      }
      if (!!textarea) {
        if (!textarea.checkValidity()) {
          textarea.classList.add("invalid");
          textarea.classList.remove("valid");
          errors_arr.push(textarea);
          error_msg.classList.add("active");
          error_msg.innerHTML = textarea.validationMessage;
        } else {
          textarea.classList.add("valid");
          textarea.classList.remove("invalid");
          error_msg.classList.remove("active");
        }
      }
      if (!!select) {
        let select_type;
        if (!select.checkValidity()) {
          select_type = select.parentElement.classList.contains("g__custom_picklist");
          if (select_type) {
            select.parentElement.classList.add("invalid");
          } else {
            select.classList.add("invalid");
          }
          errors_arr.push(select);
          error_msg.classList.add("active");
          error_msg.innerHTML = select.validationMessage;
        } else {
          if (select_type) {
            select.parentElement.classList.remove("invalid");
          } else {
            select.classList.remove("invalid");
          }
          error_msg.classList.remove("active");
        }
      }
    });
    if (!errors_arr.length && !isMidStep) {
      formContainer.submit();
    }

    if (isMidStep && !errors_arr.length) {
      return true;
    } else {
      return false;
    }
  }
  /* -------------------- checkbox ----------------------*/
  let all_checkboxes = granite_div.querySelectorAll(".g__field-checkbox, .g__field-boolean");
  if (all_checkboxes.length) {
    all_checkboxes.forEach((field) => {
      field.addEventListener("change", (e) => {
        let is_checked = e.target.checked;
        if (is_checked) {
          e.target.checked = true;
          e.target.value = "true";
          e.target.classList.toggle("g__checked");
          e.target.classList.toggle("g__unchecked");
          e.target.parentElement.classList.add("g__label-checked");
        } else {
          e.target.checked = false;
          e.target.value = "false";
          e.target.classList.toggle("g__checked");
          e.target.classList.toggle("g__unchecked");
          e.target.parentElement.classList.remove("g__label-checked");
        }
      });
    });
  }
  /* -------------------- Color field values ----------------------*/
  let colorFields = granite_div.getElementsByClassName("g__hex_value");
  if (colorFields) {
    for (let i = 0; i < colorFields.length; i++) {
      colorFields[i].addEventListener("keyup", function () {
        let first_char = this.value.substr(0, 1);
        first_char != "#" ? (this.value = "#" + this.value) : "";
        let color = this.value;
        this.previousSibling.value = color;
      });
    }
  }

  let colorPickers = granite_div.getElementsByClassName("g__field-color");
  if (colorPickers) {
    for (let i = 0; i < colorPickers.length; i++) {
      colorPickers[i].addEventListener("change", function () {
        let color = this.value;
        this.nextSibling.value = color;
      });
    }
  }
  /* -------------------- Show Password ----------------------*/
  let showPassword = document.querySelectorAll(".g__password-show");
  if (showPassword) {
    showPassword.forEach((field) => {
      field.addEventListener("click", () => {
        let password = field.previousSibling;
        let type = password.type;
        if (type === "password") {
          password.type = "text";
          field.innerHTML = '<i class="far fa-eye-slash"></i>';
        } else {
          password.type = "password";
          field.innerHTML = '<i class="far fa-eye"></i>';
        }
      });
    });
  }
  /* -------------------- File Enctype Change ----------------------*/
  let all_input = granite_div.querySelectorAll("input");
  all_input.forEach((field) => {
    let type = field.type;
    if (type === "file") {
      granite_div.enctype = "multipart/form-data";
    }
  });
  /* -------------------- File Upload ----------------------*/
  let all_files = granite_div.querySelectorAll(".g__file-container");
  all_files.forEach((file) => {
    let real_file_field = file.querySelector(".g__field-file");
    let g_file_btn = file.querySelector(".g__file-btn");
    let g_file_text = file.querySelector(".g__file-text");

    // Activate the real file field on click
    g_file_btn.addEventListener("click", () => {
      real_file_field.click();
    });

    real_file_field.addEventListener("change", () => {
      if (real_file_field.value) {
        g_file_text.innerHTML = "";
        let file_container = document.createElement("div");
        file_container.classList.add("g__selected-container");
        let file_selected = document.createElement("div");
        file_selected.classList.add("g__selected-file");
        let file_delete = document.createElement("div");
        file_delete.innerHTML = "<i class='fal fa-times'></i>";
        file_delete.setAttribute("class", "g__file-delete");
        file_delete.addEventListener("click", () => {
          if (real_file_field.value) {
            file_selected.innerHTML = "";
            g_file_text.innerText = "No file chosen, yet.";
            real_file_field.value = "";
          }
        });
        file_selected.innerHTML = real_file_field.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
        file_container.appendChild(file_selected);
        file_container.appendChild(file_delete);
        g_file_text.appendChild(file_container);
      } else {
        g_file_text.innerText = "No file chosen, yet.";
      }
    });
  });
  /* -------------------- Range Output ----------------------*/
  let all_ranges = granite_div.querySelectorAll(".g__range-container");

  all_ranges.forEach((wrap) => {
    const range = wrap.querySelector(".g__field-range");
    const output = wrap.querySelector(".g__range-output");
    const increase = wrap.querySelector(".g__range-increase");
    const decrease = wrap.querySelector(".g__range-decrease");
    const range_min = range.min;
    const range_max = range.max;
    const value = range.value;

    range.addEventListener("load", () => {
      range.value = value;
    });

    increase.addEventListener("click", () => {
      const val = parseInt(output.value);
      if (val < range_max) {
        output.value = val + 1;
        setRange(range, output.value);
      }
    });
    decrease.addEventListener("click", () => {
      const val = parseInt(output.value);
      if (val > range_min) {
        output.value = val - 1;
        setRange(range, output.value);
      }
    });

    output.addEventListener("input", () => {
      const val = output.value;
      range.value = val;
    });

    range.addEventListener("input", () => {
      setOutput(range, output);
    });

    setOutput(range, output);
  });

  function setRange(range, val) {
    range.value = val;
    const e = new Event("change", { bubbles: true });
    range.dispatchEvent(e);
    // triggerEvent(range, 'change');
  }
  function setOutput(range, output) {
    const val = range.value;
    output.value = val;
  }
  /* -------------------- Tags ----------------------*/
  const tagContainer = document.querySelectorAll(".g__tag-container");

  if (tagContainer) {
    Array.from(tagContainer).forEach((container, index) => {
      let tags = [];
      const tagInput = container.querySelector("input.g__tag-input");

      tagInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const textInput = e.target.value;
          const textArr = textInput.split(",");
          textArr.forEach((tag) => {
            tags.push(tag);
          });
          addTags();
          hiddenValue();
          tagInput.value = "";
        }
      });
      function hiddenValue() {
        const hiddenField = container.querySelector(".g__tag-hidden-values");
        hiddenField.value = "";
        tags.forEach((value) => {
          hiddenField.value += value + ";";
        });
      }
      function createTag(label) {
        const div = document.createElement("div");
        div.setAttribute("class", "g__tag");
        const span = document.createElement("span");
        span.innerHTML = label;
        const closeIcon = document.createElement("i");
        closeIcon.innerText = "x";
        closeIcon.setAttribute("class", "g__delete-tag");
        closeIcon.setAttribute("data-item", label);
        div.appendChild(span);
        div.appendChild(closeIcon);
        return div;
      }
      function addTags() {
        clearTags();
        tags
          .slice()
          .reverse()
          .forEach((tag) => {
            container.prepend(createTag(tag));
          });
      }
      function clearTags() {
        container.querySelectorAll(".g__tag").forEach((tag) => {
          tag.parentElement.removeChild(tag);
        });
      }
      container.addEventListener("click", (e) => {
        if (e.target.tagName === "I") {
          const tagLabel = e.target.getAttribute("data-item");
          const index = tags.indexOf(tagLabel);
          tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
          addTags();
        }
      });
    });
  }
} // End Form Function
