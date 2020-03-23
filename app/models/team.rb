class Team < ApplicationRecord
  has_many :chars ,through: :team_chars, dependent: :destroy
  belongs_to :user
  validates :name,
  length: { minimum: 1, maximum: 16 }
  validates :char,
    length: { maximum: 16 }
end