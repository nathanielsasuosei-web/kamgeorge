// Tiny shared contract between the header (Navbar) and the product grid:
// the header deep-links the grid via the URL (?q= / ?c=) and, when it is
// already on the home page, also fires this event so the grid filters
// in place without a reload.
export const SHOP_SEARCH_EVENT = "kamgeorge:shop-search";
