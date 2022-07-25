import graniteTable from "../../../components/table/graniteTable";
import graniteTabs from "../../../components/tabs/graniteTabs";
import "../../../components/table/graniteTable.css";

const billingHistory = {
  id: "table__billing-history",
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
      children: [{ value: "Billing Date" }, { value: "Status" }, { value: "Description", text_align: "left" }, { value: "Amount", text_align: "center" }, { value: "Invoice", text_align: "center" }],
    },
    {
      type: "row",
      href: "",
      children: [
        { value: "May 10, 2022" },
        {
          value: "<div class='g__status'><span class='g__indicator g__paid'></span>Paid</div>",
          text_align: "left",
        },
        { value: "Monthly Subscription", text_align: "left" },
        { value: "$85", text_align: "center" },
        {
          value: "<a class='g__btn g__btn-muted g__btn-sm' href='#'>Download</a>",
          text_align: "center",
        },
      ],
    },
  ],
};

graniteTable(billingHistory);

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
    g_background_hover_color: "var(--neutral-200)",
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
      name: "My Profile",
      desc: "",
      icon: "",
      href: "/Profile.html",
    },
    {
      name: "Password Reset",
      desc: "",
      href: "/passwordReset.html",
    },
    {
      name: "Billing",
      desc: "",
      href: "/billing.html",
    },
  ],
};
graniteTabs(tabs, theme);
