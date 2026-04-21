-- TahoeCamps Database Schema
-- Run this in Supabase SQL editor

CREATE TABLE campgrounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  location TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  price_per_night INTEGER,
  amenities TEXT[], -- array of amenity strings
  site_types TEXT[], -- ['RV', 'Tent', 'Cabin', 'Glamping']
  max_rig_length INTEGER,
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  images TEXT[], -- array of image URLs
  booking_url TEXT,
  cancellation_policy TEXT,
  check_in TEXT,
  check_out TEXT,
  available BOOLEAN DEFAULT true,
  season TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability table for date-specific tracking
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campground_id UUID REFERENCES campgrounds(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available_sites INTEGER DEFAULT 0,
  price_override INTEGER, -- if price changes on specific dates
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campground_id, date)
);

-- Bookings table (for future direct booking)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campground_id UUID REFERENCES campgrounds(id),
  user_email TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER,
  site_type TEXT,
  total_price INTEGER,
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
  booking_ref TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE campgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access for campgrounds
CREATE POLICY "Public can read campgrounds" ON campgrounds FOR SELECT USING (true);
CREATE POLICY "Public can read availability" ON availability FOR SELECT USING (true);

-- Insert seed data
INSERT INTO campgrounds (name, slug, description, location, lat, lng, price_per_night, amenities, site_types, max_rig_length, rating, review_count, images, booking_url, cancellation_policy, check_in, check_out, available, season) VALUES
('Tahoe Valley Campground', 'tahoe-valley', 'Large RV resort near South Lake Tahoe with full hookups and easy access to town.', 'South Lake Tahoe, CA', 38.9183, -120.0324, 75, ARRAY['Full Hookups','Showers','WiFi','Pool','Pet Friendly'], ARRAY['RV','Tent','Cabin'], 45, 4.2, 342, ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'], 'https://www.tahoecampground.com/reservations', 'Full refund if cancelled 14+ days before arrival. 50% refund 7-13 days. No refund within 7 days.', '2:00 PM', '11:00 AM', true, 'Year-round'),
('Lake Tahoe KOA Journey', 'lake-tahoe-koa', 'Family-friendly KOA campground one mile from Lake Tahoe.', 'South Lake Tahoe, CA', 38.8454, -120.0293, 89, ARRAY['Electric Hookups','Showers','WiFi','Store','Pet Friendly','Fire Pits'], ARRAY['RV','Tent','Cabin','Glamping'], 40, 3.9, 518, ARRAY['https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800'], 'https://koa.com/campgrounds/lake-tahoe/', 'Full refund if cancelled 7+ days before arrival. No refund within 7 days.', '1:00 PM', '11:00 AM', true, 'April - October'),
('Zephyr Cove Resort', 'zephyr-cove', 'Award-winning RV park on the southeast shore with beach and marina access.', 'Zephyr Cove, NV', 38.9932, -119.9358, 95, ARRAY['Water & Electric','Beach Access','Marina','Restaurant','Pet Friendly'], ARRAY['RV','Tent','Airstream'], 35, 3.5, 375, ARRAY['https://images.unsplash.com/photo-1571863533956-01c88e79957e?w=800'], 'https://www.zephyrcove.com/lodging/', 'Full refund if cancelled 48+ hours before arrival. $20 fee within 48 hours.', '3:00 PM', '11:00 AM', true, 'Year-round'),
('Camp Richardson Resort', 'camp-richardson', 'Historic resort on the southwest shore, steps from the beach.', 'South Lake Tahoe, CA', 38.9384, -120.0657, 65, ARRAY['Beach Access','Store','Restaurant','Bike Rentals','Fire Pits','Showers'], ARRAY['RV','Tent','Cabin'], 35, 4.4, 621, ARRAY['https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800'], 'https://camprichardson.com/camping/', 'Full refund if cancelled 30+ days. 50% refund 15-29 days. No refund within 14 days.', '2:00 PM', '12:00 PM', true, 'May - October');
