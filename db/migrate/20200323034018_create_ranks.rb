class CreateRanks < ActiveRecord::Migration[5.0]
  def change
    create_table :ranks do |t|
      t.integer :win
      t.integer :lose
      t.integer :ratio
      t.integer :team_id, foreign_key: true
    end
  end
end