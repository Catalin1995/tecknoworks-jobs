class CandidatesController < ApplicationController
  api :GET, '/api/jobs/:id/candidates', 'Return list of candidates'
  def index
    if logged(params)
      @candidates = Candidate.where(job_id: params[:job_id])
    else
      render_response('You are not logged', 400_001)
    end
  end

  api :GET, '/api/jobs/:id/all_candidates', 'Return list of candidates'
  def all_candidates
    if logged(params)
      @candidates = Candidate.all
    else
      render_response('You are not logged', 400_001)
    end
  end

  api :GET, '/api/jobs/:id/candidates/:id', 'Return candidate by id'
  def show
    if logged(params)
      @candidate = Candidate.find(params[:id])
    else
      render_response('You are not logged', 400_001)
    end
  end

  api :POST, '/api/jobs/:id/candidates', 'Create an candidate'
  def create
    if logged(params)
      @candidate = Candidate.create!(candidate_params)
    else
      render_response('You are not logged', 400_001)
    end
  end

  api :DELETE, '/api/jobs/:id/candidates/:id', 'Delete an candidate'
  def destroy
    if logged(params)
      @candidate = Candidate.find(params[:id])
      @candidate.delete
    else
      render_response('You are not logged', 400_001)
    end
  end

  api :UPDATE, 'api/jobs/:id/candidates/:id', 'Update an candidate'
  def update
    if logged(params)
      @candidate = Candidate.find(params[:id])
      @candidate.update_attributes!(candidate_params)
    else
      render_response('You are not logged', 400_001)
    end
  end

  private

  def candidate_params
    params.require(:candidate).permit(:full_name, :phone_number, :email, :job_id, :source)
  end
end
