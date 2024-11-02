-- Create Users table with role column
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    profile_picture_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'regular',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    image_url TEXT,
    brand VARCHAR(100),
    price DECIMAL(10, 2),
    commercial_link VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Outfits table
CREATE TABLE IF NOT EXISTS outfits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    tags TEXT[],
    item_ids INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    outfit_id INTEGER REFERENCES outfits(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    shared_post_id INTEGER REFERENCES posts(id) ON DELETE SET NULL
);

-- Create Follows table
CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    followed_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, followed_id)
);

-- Create Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Create a new table for post likes
CREATE TABLE IF NOT EXISTS post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- Insert sample data (wrapped in DO blocks to avoid duplicate key violations)
DO $$
BEGIN

    -- Insert sample users
   IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'harungokcegoz92@gmail.com') THEN
        INSERT INTO users (email, name, google_id, role, profile_picture_url) VALUES
        ('harungokcegoz92@gmail.com', 'Harun Gokcegoz', 'google_id_1', 'influencer', 'https://media.licdn.com/dms/image/v2/D4E03AQGQSaPi05dTwg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702205356453?e=1734566400&v=beta&t=KJ3mlI8ctcSiK6sBWdvQM9Tp5mYoxGWuW3_1-UJXrh4');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'jumanahalawfi1517@gmail.com') THEN
        INSERT INTO users (email, name, google_id, role, profile_picture_url) VALUES
        ('jumanahalawfi1517@gmail.com', 'Jumanah Alawfi', 'google_id_2', 'regular', 'https://media.licdn.com/dms/image/v2/D4E03AQF4G39f8WTx8A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1670429088201?e=1734566400&v=beta&t=2xzcWe8UcQOXwwMgShVw7jj1YSwDQegKAN3BVsr5wa4');
    END IF;

    -- Sample Items for User 1 (Harun)
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'White T-Shirt' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'White T-Shirt', 'Tshirts', 'White', 'https://cdn-images.farfetch-contents.com/23/88/70/39/23887039_54339637_1000.jpg', 'Wales Bonner
', 195, 'https://www.farfetch.com/nl/shopping/men/wales-bonner-jazz-print-cotton-t-shirt-item-23887039.aspx?storeid=13537');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Striped Navy Tee' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Striped Navy Tee', 'Tshirts', 'Navy', 'https://cdn-images.farfetch-contents.com/18/19/14/45/18191445_38735822_1000.jpg', 'Comme Des Garçons Play', 102, 'https://www.farfetch.com/nl/shopping/men/comme-des-garcons-play-logo-embroidered-striped-t-shirt-item-18191445.aspx?storeid=10293');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Graphic Print Tee' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Graphic Print Tee', 'Tshirts', 'Black', 'https://cdn-images.farfetch-contents.com/18/79/59/69/18795969_40718602_1000.jpg', 'Supreme', 140, 'https://www.farfetch.com/nl/shopping/men/supreme-float-tee-sneakers-item-18795969.aspx?storeid=11218');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'V-Neck Gray Tee' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'V-Neck Gray Tee', 'Tshirts', 'Gray', 'https://cdn-images.farfetch-contents.com/16/46/40/07/16464007_32028280_1000.jpg', 'James Perse Lotus', 280, 'https://www.farfetch.com/nl/shopping/men/james-perse-lotus-v-neck-t-shirt-item-16464007.aspx?storeid=10212');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Denim Jacket' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Denim Jacket', 'Jackets', 'Blue', 'https://cdn-images.farfetch-contents.com/23/83/27/40/23832740_54310185_1000.jpg', 'Acne Studios', 850, 'https://www.farfetch.com/nl/shopping/men/acne-studios-shearling-collar-distressed-denim-jacket-item-23832740.aspx?storeid=11786');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Leather Biker Jacket' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Leather Biker Jacket', 'Jackets', 'Black', 'https://cdn-images.farfetch-contents.com/22/05/48/49/22054849_52398096_1000.jpg', 'Dolce & Gabbana', 595, 'https://www.farfetch.com/nl/shopping/men/dolce-gabbana-grained-leather-biker-jacket-item-22054849.aspx?storeid=13218');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Bomber Jacket' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Bomber Jacket', 'Jackets', 'Green', 'https://cdn-images.farfetch-contents.com/24/89/28/62/24892862_55093144_1000.jpg', 'Off-white', 2950, 'https://www.farfetch.com/nl/shopping/men/off-white-x-ac-milan-logo-appliqued-varsity-jacket-item-24892862.aspx?storeid=12572');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Windbreaker' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Windbreaker', 'Jackets', 'Red', 'https://cdn-images.farfetch-contents.com/17/64/75/76/17647576_39225373_1000.jpg', 'Moncler', 499, 'https://www.farfetch.com/nl/shopping/men/moncler-ichiro-zip-up-windbreaker-jacket-item-17647576.aspx?storeid=10704');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Slim Fit Jeans' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Slim Fit Jeans', 'Bottoms', 'Blue', 'https://cdn-images.farfetch-contents.com/23/85/45/25/23854525_53944690_1000.jpg', 'Diesel', 350, 'https://www.farfetch.com/nl/shopping/men/diesel-x-toff-graphic-print-slim-fit-jeans-item-23854525.aspx?storeid=11722');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chino Pants' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Chino Pants', 'Bottoms', 'Khaki', 'https://cdn-images.farfetch-contents.com/23/74/82/29/23748229_54560770_1000.jpg', 'Sandro', 245, 'https://www.farfetch.com/nl/shopping/men/sandro-pressed-crease-trousers-item-23748229.aspx?storeid=12092');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Cargo Shorts' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Cargo Shorts', 'Bottoms', 'Olive', 'https://cdn-images.farfetch-contents.com/23/10/89/99/23108999_53174388_1000.jpg', 'Daily Paper', 125, 'https://www.farfetch.com/nl/shopping/men/daily-paper-monogram-print-cargo-shorts-item-23108999.aspx?storeid=14928');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Track Pants' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Track Pants', 'Bottoms', 'Navy', 'https://cdn-images.farfetch-contents.com/22/46/90/62/22469062_52374296_1000.jpg', 'Adidas', 533, 'https://www.farfetch.com/nl/shopping/men/denim-tears-drawstring-cotton-wreath-track-pants-item-22469062.aspx?storeid=11218');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Classic Sneakers' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Classic Sneakers', 'Shoes', 'White', 'https://cdn-images.farfetch-contents.com/23/07/44/35/23074435_54066589_1000.jpg', 'Palm Angels', 495, 'https://www.farfetch.com/nl/shopping/men/palm-angels-venice-sneakers-item-23074435.aspx?storeid=12592');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Running Shoes' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Running Shoes', 'Shoes', 'Black', 'https://cdn-images.farfetch-contents.com/20/85/37/52/20853752_51031829_1000.jpg', 'Nike', 190, 'https://www.farfetch.com/nl/shopping/men/on-running-cloudultra-2-low-top-sneakers-item-20853752.aspx?storeid=13537');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Leather Oxfords' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Leather Oxfords', 'Shoes', 'Brown', 'https://cdn-images.farfetch-contents.com/19/11/56/15/19115615_43662813_1000.jpg', 'Cole Haan', 1711, 'https://www.farfetch.com/nl/shopping/men/bontoni-leather-oxford-shoes-item-19115615.aspx?storeid=9610');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Slip-on Loafers' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Slip-on Loafers', 'Shoes', 'Tan', 'https://cdn-images.farfetch-contents.com/19/41/93/60/19419360_42730098_1000.jpg', 'Clarks', 89.99, 'https://www.farfetch.com/nl/shopping/men/henderson-baracco-pebbled-finish-slip-on-loafers-item-19419360.aspx?storeid=9269');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Rolex' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Rolex', 'Watches', 'Silver', 'https://schapi-products.s3.eu-central-1.amazonaws.com/3665242/m126234-0051_drp-upright-bba-with-shadow.webp', 'Rolex', 9400, 'https://rolex.schaapcitroen.nl/rolex-watches/datejust/');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Rolex' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Chronograph Watch', 'Watches', 'Black', 'https://media.rolex.com/image/upload/q_auto:eco/f_auto/t_v7-grid/c_limit,w_2440/v1/catalogue/2024/upright-bba-with-shadow/m126233-0015', 'Fossil', 15449.00, 'https://www.rolex.com/nl/watches/datejust/m126333-0010');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Audemars Piguet' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Audemars Piguet', 'Watches', 'Blue', 'https://watchbox-cdn.imgix.net/posted-product-images/638469673486669855_AUDE303891_4945580_100591_41-31.jpg?auto=format,compress&bg-remove=true&w=1480&h=1480&fit=fill&fill=solid&q=100', 'Audemars Piguet', 35000, 'https://www.the1916company.com/pre-owned/audemars-piguet/royal-oak/5000311/');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Audemars Piguet' AND user_id = 1) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (1, 'Audemars Piguet', 'Watches', 'Space Gray', 'https://watchbox-cdn.imgix.net/posted-product-images/638429132588270953_aude314738_4928297_99944_36-1.jpg', 'Audemars Piguet', 399.00, 'https://www.the1916company.com/pre-owned/audemars-piguet/royal-oak/royal-oak-14790st.oo.0789st.01/');
    END IF;

    --  Sample Items for User 2 (Jumanah)
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'White T-Shirt' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'White T-Shirt', 'Tshirts', 'White', 'https://cdn-images.farfetch-contents.com/23/88/70/39/23887039_54339637_1000.jpg', 'Wales Bonner
', 195, 'https://www.farfetch.com/nl/shopping/men/wales-bonner-jazz-print-cotton-t-shirt-item-23887039.aspx?storeid=13537');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Striped Navy Tee' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Striped Navy Tee', 'Tshirts', 'Navy', 'https://cdn-images.farfetch-contents.com/18/19/14/45/18191445_38735822_1000.jpg', 'Comme Des Garçons Play', 102, 'https://www.farfetch.com/nl/shopping/men/comme-des-garcons-play-logo-embroidered-striped-t-shirt-item-18191445.aspx?storeid=10293');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Graphic Print Tee' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Graphic Print Tee', 'Tshirts', 'Black', 'https://cdn-images.farfetch-contents.com/18/79/59/69/18795969_40718602_1000.jpg', 'Supreme', 140, 'https://www.farfetch.com/nl/shopping/men/supreme-float-tee-sneakers-item-18795969.aspx?storeid=11218');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'V-Neck Gray Tee' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'V-Neck Gray Tee', 'Tshirts', 'Gray', 'https://cdn-images.farfetch-contents.com/16/46/40/07/16464007_32028280_1000.jpg', 'James Perse Lotus', 280, 'https://www.farfetch.com/nl/shopping/men/james-perse-lotus-v-neck-t-shirt-item-16464007.aspx?storeid=10212');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Denim Jacket' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Denim Jacket', 'Jackets', 'Blue', 'https://cdn-images.farfetch-contents.com/23/83/27/40/23832740_54310185_1000.jpg', 'Acne Studios', 850, 'https://www.farfetch.com/nl/shopping/men/acne-studios-shearling-collar-distressed-denim-jacket-item-23832740.aspx?storeid=11786');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Leather Biker Jacket' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Leather Biker Jacket', 'Jackets', 'Black', 'https://cdn-images.farfetch-contents.com/22/05/48/49/22054849_52398096_1000.jpg', 'Dolce & Gabbana', 595, 'https://www.farfetch.com/nl/shopping/men/dolce-gabbana-grained-leather-biker-jacket-item-22054849.aspx?storeid=13218');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Bomber Jacket' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Bomber Jacket', 'Jackets', 'Green', 'https://cdn-images.farfetch-contents.com/24/89/28/62/24892862_55093144_1000.jpg', 'Off-white', 2950, 'https://www.farfetch.com/nl/shopping/men/off-white-x-ac-milan-logo-appliqued-varsity-jacket-item-24892862.aspx?storeid=12572');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Windbreaker' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Windbreaker', 'Jackets', 'Red', 'https://cdn-images.farfetch-contents.com/17/64/75/76/17647576_39225373_1000.jpg', 'Moncler', 499, 'https://www.farfetch.com/nl/shopping/men/moncler-ichiro-zip-up-windbreaker-jacket-item-17647576.aspx?storeid=10704');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Slim Fit Jeans' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Slim Fit Jeans', 'Bottoms', 'Blue', 'https://cdn-images.farfetch-contents.com/23/85/45/25/23854525_53944690_1000.jpg', 'Diesel', 350, 'https://www.farfetch.com/nl/shopping/men/diesel-x-toff-graphic-print-slim-fit-jeans-item-23854525.aspx?storeid=11722');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Chino Pants' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Chino Pants', 'Bottoms', 'Khaki', 'https://cdn-images.farfetch-contents.com/23/74/82/29/23748229_54560770_1000.jpg', 'Sandro', 245, 'https://www.farfetch.com/nl/shopping/men/sandro-pressed-crease-trousers-item-23748229.aspx?storeid=12092');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Cargo Shorts' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Cargo Shorts', 'Bottoms', 'Olive', 'https://cdn-images.farfetch-contents.com/23/10/89/99/23108999_53174388_1000.jpg', 'Daily Paper', 125, 'https://www.farfetch.com/nl/shopping/men/daily-paper-monogram-print-cargo-shorts-item-23108999.aspx?storeid=14928');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Track Pants' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Track Pants', 'Bottoms', 'Navy', 'https://cdn-images.farfetch-contents.com/22/46/90/62/22469062_52374296_1000.jpg', 'Adidas', 533, 'https://www.farfetch.com/nl/shopping/men/denim-tears-drawstring-cotton-wreath-track-pants-item-22469062.aspx?storeid=11218');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Classic Sneakers' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Classic Sneakers', 'Shoes', 'White', 'https://cdn-images.farfetch-contents.com/23/07/44/35/23074435_54066589_1000.jpg', 'Palm Angels', 495, 'https://www.farfetch.com/nl/shopping/men/palm-angels-venice-sneakers-item-23074435.aspx?storeid=12592');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Running Shoes' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Running Shoes', 'Shoes', 'Black', 'https://cdn-images.farfetch-contents.com/20/85/37/52/20853752_51031829_1000.jpg', 'Nike', 190, 'https://www.farfetch.com/nl/shopping/men/on-running-cloudultra-2-low-top-sneakers-item-20853752.aspx?storeid=13537');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Leather Oxfords' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Leather Oxfords', 'Shoes', 'Brown', 'https://cdn-images.farfetch-contents.com/19/11/56/15/19115615_43662813_1000.jpg', 'Cole Haan', 1711, 'https://www.farfetch.com/nl/shopping/men/bontoni-leather-oxford-shoes-item-19115615.aspx?storeid=9610');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Slip-on Loafers' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Slip-on Loafers', 'Shoes', 'Tan', 'https://cdn-images.farfetch-contents.com/19/41/93/60/19419360_42730098_1000.jpg', 'Clarks', 89.99, 'https://www.farfetch.com/nl/shopping/men/henderson-baracco-pebbled-finish-slip-on-loafers-item-19419360.aspx?storeid=9269');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Rolex' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Rolex', 'Watches', 'Silver', 'https://schapi-products.s3.eu-central-1.amazonaws.com/3665242/m126234-0051_drp-upright-bba-with-shadow.webp', 'Rolex', 9400, 'https://rolex.schaapcitroen.nl/rolex-watches/datejust/');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Rolex' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Chronograph Watch', 'Watches', 'Black', 'https://media.rolex.com/image/upload/q_auto:eco/f_auto/t_v7-grid/c_limit,w_2440/v1/catalogue/2024/upright-bba-with-shadow/m126233-0015', 'Fossil', 15449.00, 'https://www.rolex.com/nl/watches/datejust/m126333-0010');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Audemars Piguet' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Audemars Piguet', 'Watches', 'Blue', 'https://watchbox-cdn.imgix.net/posted-product-images/638469673486669855_AUDE303891_4945580_100591_41-31.jpg?auto=format,compress&bg-remove=true&w=1480&h=1480&fit=fill&fill=solid&q=100', 'Audemars Piguet', 35000, 'https://www.the1916company.com/pre-owned/audemars-piguet/royal-oak/5000311/');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM items WHERE name = 'Audemars Piguet' AND user_id = 2) THEN
        INSERT INTO items (user_id, name, category, color, image_url, brand, price, commercial_link) VALUES
        (2, 'Audemars Piguet', 'Watches', 'Space Gray', 'https://watchbox-cdn.imgix.net/posted-product-images/638429132588270953_aude314738_4928297_99944_36-1.jpg', 'Audemars Piguet', 399.00, 'https://www.the1916company.com/pre-owned/audemars-piguet/royal-oak/royal-oak-14790st.oo.0789st.01/');
    END IF;

     -- Insert preset outfits for User 1 (Harun)
    -- Casual Summer Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 1 AND name = 'Casual Summer Look') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (1, 'Casual Summer Look', ARRAY['summer', 'casual', 'comfortable'],
                ARRAY(SELECT id FROM items WHERE user_id = 1 AND name IN ('White T-Shirt', 'Cargo Shorts', 'Classic Sneakers')));
    END IF;

    -- Business Casual Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 1 AND name = 'Business Casual') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (1, 'Business Casual', ARRAY['work', 'professional', 'smart'],
                ARRAY(SELECT id FROM items WHERE user_id = 1 AND name IN ('V-Neck Gray Tee', 'Chino Pants', 'Leather Oxfords', 'Rolex')));
    END IF;

    -- Night Out Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 1 AND name = 'Night Out') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (1, 'Night Out', ARRAY['evening', 'stylish', 'trendy'],
                ARRAY(SELECT id FROM items WHERE user_id = 1 AND name IN ('Leather Biker Jacket', 'Graphic Print Tee', 'Slim Fit Jeans', 'Classic Sneakers', 'Audemars Piguet')));
    END IF;

    -- Insert preset outfits for User 2 (Jumanah)
    -- Sporty Chic Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 2 AND name = 'Sporty Chic') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (2, 'Sporty Chic', ARRAY['sporty', 'comfortable', 'trendy'],
                ARRAY(SELECT id FROM items WHERE user_id = 2 AND name IN ('Striped Navy Tee', 'Track Pants', 'Running Shoes')));
    END IF;

    -- Weekend Casual Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 2 AND name = 'Weekend Casual') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (2, 'Weekend Casual', ARRAY['weekend', 'relaxed', 'effortless'],
                ARRAY(SELECT id FROM items WHERE user_id = 2 AND name IN ('Denim Jacket', 'White T-Shirt', 'Slim Fit Jeans', 'Slip-on Loafers')));
    END IF;

    -- Elegant Evening Outfit
    IF NOT EXISTS (SELECT 1 FROM outfits WHERE user_id = 2 AND name = 'Elegant Evening') THEN
        INSERT INTO outfits (user_id, name, tags, item_ids) 
        VALUES (2, 'Elegant Evening', ARRAY['elegant', 'formal', 'sophisticated'],
                ARRAY(SELECT id FROM items WHERE user_id = 2 AND name IN ('Bomber Jacket', 'V-Neck Gray Tee', 'Chino Pants', 'Leather Oxfords', 'Rolex')));
    END IF;
END $$;


-- Insert sample posts
DO $$
BEGIN
    -- Sample posts for User 1 (Harun)
    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 1 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Casual Summer Look' AND user_id = 1 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 1, id, 15, 3, 5
        FROM outfits
        WHERE name = 'Casual Summer Look' AND user_id = 1
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 1 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Business Casual' AND user_id = 1 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 1, id, 28, 7, 10
        FROM outfits
        WHERE name = 'Business Casual' AND user_id = 1
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 1 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Night Out' AND user_id = 1 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 1, id, 42, 12, 18
        FROM outfits
        WHERE name = 'Night Out' AND user_id = 1
        LIMIT 1;
    END IF;

    -- Sample posts for User 2 (Jumanah)
    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 2 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Sporty Chic' AND user_id = 2 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 2, id, 33, 8, 12
        FROM outfits
        WHERE name = 'Sporty Chic' AND user_id = 2
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 2 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Weekend Casual' AND user_id = 2 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 2, id, 20, 5, 7
        FROM outfits
        WHERE name = 'Weekend Casual' AND user_id = 2
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM posts WHERE user_id = 2 AND outfit_id = (SELECT id FROM outfits WHERE name = 'Elegant Evening' AND user_id = 2 LIMIT 1)) THEN
        INSERT INTO posts (user_id, outfit_id, likes_count, shares_count, bookmarks_count)
        SELECT 2, id, 55, 15, 22
        FROM outfits
        WHERE name = 'Elegant Evening' AND user_id = 2
        LIMIT 1;
    END IF;

    -- Add some sample follows
    IF NOT EXISTS (SELECT 1 FROM follows WHERE follower_id = 1 AND followed_id = 2) THEN
        INSERT INTO follows (follower_id, followed_id) VALUES (1, 2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM follows WHERE follower_id = 2 AND followed_id = 1) THEN
        INSERT INTO follows (follower_id, followed_id) VALUES (2, 1);
    END IF;

    -- Add some sample bookmarks
    IF NOT EXISTS (SELECT 1 FROM bookmarks WHERE user_id = 1 AND post_id = (SELECT id FROM posts WHERE user_id = 2 LIMIT 1)) THEN
        INSERT INTO bookmarks (user_id, post_id)
        SELECT 1, id
        FROM posts
        WHERE user_id = 2
        LIMIT 1;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM bookmarks WHERE user_id = 2 AND post_id = (SELECT id FROM posts WHERE user_id = 1 LIMIT 1)) THEN
        INSERT INTO bookmarks (user_id, post_id)
        SELECT 2, id
        FROM posts
        WHERE user_id = 1
        LIMIT 1;
    END IF;

END $$;

-- Add some sample likes
DO $$
BEGIN
    -- Add likes for User 1
    IF NOT EXISTS (SELECT 1 FROM post_likes WHERE user_id = 1 AND post_id = (SELECT id FROM posts WHERE user_id = 2 LIMIT 1)) THEN
        INSERT INTO post_likes (user_id, post_id)
        SELECT 1, id
        FROM posts
        WHERE user_id = 2
        LIMIT 1;
    END IF;

    -- Add likes for User 2
    IF NOT EXISTS (SELECT 1 FROM post_likes WHERE user_id = 2 AND post_id = (SELECT id FROM posts WHERE user_id = 1 LIMIT 1)) THEN
        INSERT INTO post_likes (user_id, post_id)
        SELECT 2, id
        FROM posts
        WHERE user_id = 1
        LIMIT 1;
    END IF;
END $$;