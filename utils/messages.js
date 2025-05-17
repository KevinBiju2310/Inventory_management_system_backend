const MESSAGES = {
  USER_CREATED: "User created successfully",
  EMAIL_EXISTS: "Email already exists",
  ERROR_CREATING_USER: "Error creating user",
  INTERNAL_SERVER_ERROR: "Internal server error",
  USER_NOT_FOUND: "User not found",
  PASSWORD_INCORRECT: "Password is incorrect",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",

  CUSTOMER_EXISTS: "Customer already exists",
  CUSTOMER_ADDED: "Customer added successfully",
  CUSTOMERS_RETRIEVED: "Customers retrieved successfully",
  CUSTOMER_NOT_FOUND: "Customer not found",
  CUSTOMER_NAME_REQUIRED: "Customer name is required for ledger",

  ITEM_EXISTS: "Item already exists",
  ITEM_CREATED: "Item created successfully",
  ITEM_NOT_FOUND: "Item not found",
  ITEM_UPDATED: "Item updated successfully",
  ITEM_DELETED: "Item deleted successfully",
  ITEMS_RETRIEVED: "Items retrieved successfully",
  INSUFFICIENT_STOCK: (itemName) => `Insufficient stock for ${itemName}`,

  ORDER_SUCCESS: "Order placed successfully",
  INVALID_ITEMS: "One or more items are invalid",
};

module.exports = MESSAGES;
