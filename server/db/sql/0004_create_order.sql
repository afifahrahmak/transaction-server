CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER DEFAULT 1 NOT NULL,
  total_price INTEGER,
  is_paid BOOLEAN DEFAULT false NOT NULL,
  order_date DATE NOT NULL,
  paid_date DATE, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);