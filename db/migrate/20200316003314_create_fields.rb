class CreateFields < ActiveRecord::Migration[5.0]
  def change
    create_table :fields do |t|
      t.references :char, foreign_key: true, dependent: :destroy
      t.references :team, foreign_key: true, dependent: :destroy
    end
  end
end
