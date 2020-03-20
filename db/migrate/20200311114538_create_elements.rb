class CreateElements < ActiveRecord::Migration[5.0]
  def change
    create_table :elements do |t|
      t.string :name, null: false
      t.float :to_fire, null: false
      t.float :to_water, null: false
      t.float :to_wood, null: false
      t.float :to_lightness, null: false
      t.float :to_darkness, null: false
      t.float :from_fire, null: false
      t.float :from_water, null: false
      t.float :from_wood, null: false
      t.float :from_lightness, null: false
      t.float :from_darkness, null: false
    end
  end
end
