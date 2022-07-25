import graniteTable from "../../../components/table/graniteTable";
import graniteTabs from "../../../components/tabs/graniteTabs";
import "../../../components/table/graniteTable.css";

const dataConnections = {
  id: "table__my-connections",
  feature: "table",
  options: {
    type: "table",
    fixed: true,
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
      children: [{ value: "Connection Type" }, { value: "Username" }, { value: "Connected Date", text_align: "center" }, { value: "Status", text_align: "center" }, { value: "Access", text_align: "center" }],
    },
    {
      type: "row",
      href: "",
      dropdown: true,
      children: [
        {
          value: "<img class='g__connection-logo' src='https://cdn.addapptation.com/addapptation/granite/Salesforce-logo_db.png'>Salesforce",
        },
        {
          value: "j.smith@gmail.com",
          text_align: "left",
        },
        { value: "08/12/21 ", text_align: "center" },
        { value: "Active", text_align: "center" },
        {
          value: "<a class='g__btn g__btn-neutral g__btn-sm' href='#'>Remove</a>",
          text_align: "center",
        },
      ],
    },
    {
      type: "dropdown",
      children: [
        {
          value:
            "You have granted the following access to the service: Use the primary email address associated with your Facebook avvount, Create, modify and delete posts, comments and reactions on your behalf, Retrieve reporting for your advertising accounts, Manage your organizations’ pages and retrieve reporting data, Use your name and photo",
        },
      ],
    },
    {
      type: "row",
      href: "",
      dropdown: true,
      children: [
        {
          value: "<img class='g__connection-logo' src='https://cdn.addapptation.com/addapptation/granite/db_hubspot.svg'>Hubspot",
        },
        {
          value: "j.smith@gmail.com",
          text_align: "left",
        },
        { value: "08/12/21 ", text_align: "center" },
        { value: "Active", text_align: "center" },
        {
          value: "<a class='g__btn g__btn-neutral g__btn-sm' href='#'>Remove</a>",
          text_align: "center",
        },
      ],
    },
    {
      type: "dropdown",
      children: [
        {
          value:
            "You have granted the following access to the service: Use the primary email address associated with your Facebook avvount, Create, modify and delete posts, comments and reactions on your behalf, Retrieve reporting for your advertising accounts, Manage your organizations’ pages and retrieve reporting data, Use your name and photo",
        },
      ],
    },
  ],
};

graniteTable(dataConnections);

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
      href: "/inviteUsers.html",
    },
    {
      name: "Data Connections",
      desc: "",
      href: "/dataConnections.html",
    },
  ],
};
graniteTabs(tabs, theme);
