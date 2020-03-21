class CreateWars < ActiveRecord::Migration[5.0]
  def change
    create_table :wars do |t|
      t.string :name
      t.integer :field_id
      t.integer :char_id
      t.integer :vitality
      t.integer :attack
      t.integer :spped
      t.integer :battle_id
      t.integer :movement_id
      t.integer :element_id
      t.integer :team
    end
  end
end
