class CreateTeamChars < ActiveRecord::Migration[5.0]
  def change
    create_table :team_chars do |t|
      t.references :team, null: false, foreign_key: true, dependent: :destroy
      t.references :char, null: false, foreign_key: true, dependent: :destroy
    end
  end
end
