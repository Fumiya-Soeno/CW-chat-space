class UsersController < ApplicationController
  before_action :set_params

  def index
    return nil if params[:keyword] == ""
    @users = User.where(['name LIKE ?', "%#{params[:keyword]}%"] ).where.not(id: current_user.id).limit(10)
    respond_to do |format|
      format.json
      format.html
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end

  def set_params
    @team_ranks = [];
    @ranks = Rank.all.order(ratio: "DESC")
    @teams = Team.all
    @ranks.each do|rank|
      @teams.each do|team|
        if team.id == rank.team_id
          @team_ranks << {name: team.name,win: rank.win,lose: rank.lose, ratio: rank.ratio}
        end
      end
    end
  end
  
end
