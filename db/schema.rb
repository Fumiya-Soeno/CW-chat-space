# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200323125250) do

  create_table "battles", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name", null: false
  end

  create_table "chars", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string  "name",        null: false
    t.integer "vitality",    null: false
    t.integer "attack",      null: false
    t.integer "speed",       null: false
    t.integer "battle_id",   null: false
    t.integer "movement_id", null: false
    t.integer "element_id",  null: false
    t.index ["battle_id"], name: "index_chars_on_battle_id", using: :btree
    t.index ["element_id"], name: "index_chars_on_element_id", using: :btree
    t.index ["movement_id"], name: "index_chars_on_movement_id", using: :btree
  end

  create_table "elements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name",                      null: false
    t.float  "to_fire",        limit: 24, null: false
    t.float  "to_water",       limit: 24, null: false
    t.float  "to_wood",        limit: 24, null: false
    t.float  "to_lightness",   limit: 24, null: false
    t.float  "to_darkness",    limit: 24, null: false
    t.float  "from_fire",      limit: 24, null: false
    t.float  "from_water",     limit: 24, null: false
    t.float  "from_wood",      limit: 24, null: false
    t.float  "from_lightness", limit: 24, null: false
    t.float  "from_darkness",  limit: 24, null: false
  end

  create_table "fields", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "char_id"
    t.integer "team_id"
    t.index ["char_id"], name: "index_fields_on_char_id", using: :btree
    t.index ["team_id"], name: "index_fields_on_team_id", using: :btree
  end

  create_table "group_users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "group_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_group_users_on_group_id", using: :btree
    t.index ["user_id"], name: "index_group_users_on_user_id", using: :btree
  end

  create_table "groups", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_groups_on_name", unique: true, using: :btree
  end

  create_table "messages", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "content"
    t.string   "image"
    t.integer  "group_id"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["group_id"], name: "index_messages_on_group_id", using: :btree
    t.index ["user_id"], name: "index_messages_on_user_id", using: :btree
  end

  create_table "movements", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name", null: false
  end

  create_table "ranks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "win"
    t.integer "lose"
    t.integer "ratio"
    t.integer "team_id"
  end

  create_table "team_chars", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "team_id", null: false
    t.integer "char_id", null: false
    t.index ["char_id"], name: "index_team_chars_on_char_id", using: :btree
    t.index ["team_id"], name: "index_team_chars_on_team_id", using: :btree
  end

  create_table "teams", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "char",       null: false
    t.integer  "user_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_teams_on_user_id", using: :btree
  end

  create_table "teams_", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "char",       null: false
    t.integer  "user_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name",                                null: false
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["name"], name: "index_users_on_name", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  create_table "wars", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string  "name"
    t.integer "field_id"
    t.integer "char_id"
    t.integer "vitality"
    t.integer "attack"
    t.integer "spped"
    t.integer "battle_id"
    t.integer "movement_id"
    t.integer "element_id"
    t.integer "team"
  end

  add_foreign_key "chars", "battles"
  add_foreign_key "chars", "elements"
  add_foreign_key "chars", "movements"
  add_foreign_key "fields", "chars"
  add_foreign_key "fields", "teams_", column: "team_id"
  add_foreign_key "group_users", "groups"
  add_foreign_key "group_users", "users"
  add_foreign_key "messages", "groups"
  add_foreign_key "messages", "users"
  add_foreign_key "team_chars", "chars"
  add_foreign_key "team_chars", "teams_", column: "team_id"
  add_foreign_key "teams", "users"
end
