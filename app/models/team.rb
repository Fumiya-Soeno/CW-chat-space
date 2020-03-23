class Team < ApplicationRecord
  has_many :chars ,through: :team_chars, dependent: :destroy
  belongs_to :user
  validates :char,length: { maximum: 16 }
end