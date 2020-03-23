class Char < ApplicationRecord
  has_many :teams ,through: :team_chars, dependent: :destroy
  belongs_to :battle
  belongs_to :movement
  belongs_to :element
end
