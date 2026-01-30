CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"avatar_url" text,
	"user_type" text DEFAULT 'Individual' NOT NULL,
	"company_id" uuid,
	"role" text DEFAULT 'Buyer' NOT NULL,
	"verification_status" text DEFAULT 'Unverified' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"company_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"trading_name" text,
	"tax_id" text NOT NULL,
	"business_type" text NOT NULL,
	"industry" text NOT NULL,
	"address" jsonb NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text NOT NULL,
	"verification_status" text DEFAULT 'Pending' NOT NULL,
	"verification_docs" jsonb,
	"credit_limit" double precision DEFAULT 0 NOT NULL,
	"payment_terms" text DEFAULT 'Immediate' NOT NULL,
	"credit_balance" double precision DEFAULT 0 NOT NULL,
	"admin_user_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_tax_id_unique" UNIQUE("tax_id")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_id" uuid,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"listing_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"listing_type" text DEFAULT 'Fixed' NOT NULL,
	"customer_type" text DEFAULT 'Both' NOT NULL,
	"price" double precision NOT NULL,
	"b2b_price" double precision,
	"min_order_qty" integer DEFAULT 1 NOT NULL,
	"stock_quantity" integer DEFAULT 1 NOT NULL,
	"weight" double precision,
	"dimensions" jsonb,
	"media_urls" jsonb DEFAULT '[]' NOT NULL,
	"specifications" jsonb,
	"status" text DEFAULT 'Draft' NOT NULL,
	"expires_at" timestamp,
	"view_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auctions" (
	"auction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"min_bid" double precision NOT NULL,
	"current_high_bid" double precision,
	"bid_increment" double precision DEFAULT 1 NOT NULL,
	"reserve_price" double precision,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"winner_id" uuid,
	"status" text DEFAULT 'Scheduled' NOT NULL,
	"bid_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bids" (
	"bid_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auction_id" uuid NOT NULL,
	"bidder_id" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"max_bid" double precision,
	"is_proxy" boolean DEFAULT false NOT NULL,
	"is_winning" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"order_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"buyer_id" uuid NOT NULL,
	"company_id" uuid,
	"order_type" text DEFAULT 'B2C' NOT NULL,
	"po_number" text,
	"subtotal" double precision NOT NULL,
	"bulk_discount" double precision DEFAULT 0 NOT NULL,
	"tax_amount" double precision DEFAULT 0 NOT NULL,
	"shipping_fee" double precision DEFAULT 0 NOT NULL,
	"platform_fee" double precision DEFAULT 0 NOT NULL,
	"total_amount" double precision NOT NULL,
	"payment_terms" text DEFAULT 'Immediate' NOT NULL,
	"payment_due_date" timestamp,
	"order_status" text DEFAULT 'Pending' NOT NULL,
	"shipping_address" jsonb NOT NULL,
	"billing_address" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"item_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" double precision NOT NULL,
	"total_price" double precision NOT NULL,
	"item_status" text DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"transaction_ref" text,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"escrow_status" text DEFAULT 'Held' NOT NULL,
	"payment_method" text NOT NULL,
	"payment_provider" text NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_transaction_ref_unique" UNIQUE("transaction_ref")
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"payout_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"bank_account_info" jsonb NOT NULL,
	"status" text DEFAULT 'Scheduled' NOT NULL,
	"scheduled_date" timestamp NOT NULL,
	"processed_at" timestamp,
	"transaction_ref" text,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping" (
	"shipping_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"order_item_id" uuid,
	"carrier_name" text NOT NULL,
	"tracking_number" text,
	"shipping_cost" double precision DEFAULT 0 NOT NULL,
	"estimated_delivery" timestamp,
	"actual_delivery" timestamp,
	"status" text DEFAULT 'Pending' NOT NULL,
	"signature_required" boolean DEFAULT false NOT NULL,
	"tracking_history" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"dispute_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"raised_by" uuid NOT NULL,
	"against" uuid NOT NULL,
	"reason_code" text NOT NULL,
	"description" text NOT NULL,
	"evidence_urls" jsonb,
	"status" text DEFAULT 'Open' NOT NULL,
	"resolution" text DEFAULT 'Pending' NOT NULL,
	"resolution_notes" text,
	"resolved_by" uuid,
	"response_deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"title" text,
	"comment" text,
	"media_urls" jsonb,
	"is_verified_purchase" boolean DEFAULT true NOT NULL,
	"is_moderated" boolean DEFAULT false NOT NULL,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"seller_response" text,
	"seller_response_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "revenue" (
	"ledger_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"gross_amount" double precision NOT NULL,
	"platform_fee" double precision NOT NULL,
	"processing_fee" double precision DEFAULT 0 NOT NULL,
	"net_payout" double precision NOT NULL,
	"fee_percentage" double precision NOT NULL,
	"status" text DEFAULT 'Pending' NOT NULL,
	"payout_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"conversation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"listing_id" uuid,
	"status" text DEFAULT 'Active' NOT NULL,
	"last_message_preview" text,
	"last_message_at" timestamp,
	"buyer_unread_count" integer DEFAULT 0 NOT NULL,
	"seller_unread_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"message_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'Text' NOT NULL,
	"attachment_url" text,
	"attachment_name" text,
	"attachment_size" integer,
	"status" text DEFAULT 'Sent' NOT NULL,
	"deleted_for_sender" boolean DEFAULT false NOT NULL,
	"deleted_for_recipient" boolean DEFAULT false NOT NULL,
	"reply_to_message_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"edited_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_listing_id_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("listing_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auctions" ADD CONSTRAINT "auctions_winner_id_users_user_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_auction_id_auctions_auction_id_fk" FOREIGN KEY ("auction_id") REFERENCES "public"."auctions"("auction_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bids" ADD CONSTRAINT "bids_bidder_id_users_user_id_fk" FOREIGN KEY ("bidder_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_company_id_companies_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("company_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_listing_id_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("listing_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipping" ADD CONSTRAINT "shipping_order_item_id_order_items_item_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("item_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_raised_by_users_user_id_fk" FOREIGN KEY ("raised_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_against_users_user_id_fk" FOREIGN KEY ("against") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_resolved_by_users_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue" ADD CONSTRAINT "revenue_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue" ADD CONSTRAINT "revenue_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_buyer_id_users_user_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_listing_id_listings_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("listing_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("conversation_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;