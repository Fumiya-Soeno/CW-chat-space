class CreateTeams < ActiveRecord::Migration[5.0]
  def change
    create_table :teams do |t|
      t.string :name, null: false
      t.string :char, null: false
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
