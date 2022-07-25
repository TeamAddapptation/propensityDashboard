import graniteTable from "../../../components/table/graniteTable";
import "../../../components/table/graniteTable.css";

const users = {
  id: "table__users",
  feature: "table",
  options: {
    type: "table",
    datatables: false,
    searching: false,
    paging: false,
    page_length: 10,
    export: true,
  },
  records: [
    {
      type: "header",
      background: "#FAFAFA",
      children: [
        { value: "Name" },
        { value: "Username" },
        { value: "Permissions", text_align: "center" },
        { value: "Access", text_align: "center" },
      ],
    },
    {
      type: "row",
      href: "",
      dropdown: false,
      children: [
        {
          value: "Jeremy Smith<br>Marketing Manager",
        },
        {
          value: "j.smith@gmail.com",
          text_align: "left",
        },
        {
          value: `<select class="g__table-select"><option value="admin">Admin</option><option selected value="editor">Editor</option>
        <option value="view-only">View Only</option></select>`,
          text_align: "center",
        },
        {
          value:
            "<a class='g__btn g__btn-neutral g__btn-sm' href='#'>Remove</a>",
          text_align: "center",
        },
      ],
    },
    {
      type: "row",
      href: "",
      dropdown: false,
      children: [
        {
          value: "Jill Bakalar<br>Data Analyst",
        },
        {
          value: "jill_bakalar@gmail.com",
          text_align: "left",
        },
        {
          value: `<select class="g__table-select"><option selected value="admin">Admin</option><option value="editor">Editor</option>
        <option value="view-only">View Only</option></select>`,
          text_align: "center",
        },
        {
          value:
            "<a class='g__btn g__btn-neutral g__btn-sm' href='#'>Remove</a>",
          text_align: "center",
        },
      ],
    },
  ],
};

graniteTable(users);

const theme = {
  mode: "standard",
};

const tabs = {
  id: "tabs__workspace",
  options: {
    g_style: "line", // step, line, block
    g_align_tabs: "left",
    g_font_size: "14",
    g_font_color: "#5d5d5d",
    g_font_hover_color: "#a4a4a4",
    g_icon_size: "",
    g_step_number_color: "",
    g_title_size: "16",
    g_title_color: "",
    g_description_size: "12px",
    g_description_color: "",
    g_highlight_color: "#5D50E6",
    g_background_color: "#ffffff",
    g_background_active_color: "#F7F6FE",
    g_background_hover_color: "#F7F6FE",
    g_align: "left",
    g_align_icon: "flex-start",
    g_direction: false,
    g_padding: "10px 40px",
    g_margin: "0",
    g_border_width: "",
    g_border_color: "red",
    g_border_radius: "",
    g_full_width: true,
    padding_top: "0",
    padding_bottom: "0",
    margin_top: "0",
    margin_bottom: "0",
    g_classes: "",
    g_cursor_disabled: false,
    g_action: "hash_builder",
    container_top_padding: "0",
    container_bottom_padding: "0",
  },
  records: [
    {
      name: "Invite Users",
      desc: "",
      icon: "",
      href: "/invite_users?tab=1",
    },
    {
      name: "Data Connections",
      desc: "",
      href: "/data_connections?tab=2",
    },
    {
      name: "Installed Packages",
      desc: "",
      href: "/installed_packages?tab=3",
    },
  ],
};
graniteTabs(tabs, theme);
