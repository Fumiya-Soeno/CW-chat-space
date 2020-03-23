class CreateChars < ActiveRecord::Migration[5.0]
  def change
    create_table :chars do |t|
      t.string :name, null: false
      t.integer :vitality, null: false
      t.integer :attack, null: false
      t.integer :speed, null: false
      t.references :battle, null: false, foreign_key: true, dependent: :destroy
      t.references :movement, null: false, foreign_key: true, dependent: :destroy
      t.references :element, null: false, foreign_key: true, dependent: :destroy
    end
  end
end