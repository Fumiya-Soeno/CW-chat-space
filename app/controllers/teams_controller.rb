class TeamsController < ApplicationController
  before_action :set_user
  before_action :set_teams_params

  def index
  end

  def new
    @team = Team.new
  end

  def create
    @team = Team.new(team_params)
    if @team.save
      redirect_to user_teams_path(@user), notice: 'チームを作成しました'
    else
      render :new
    end
  end

  def set_user
    @user = User.find(current_user)
  end

  def set_teams_params
    teams = Team.select(:name,:char)
  end

  private
  def team_params
    params.require(:team).permit(:name,:char).merge(user_id: current_user.id)
  end

end