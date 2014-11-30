Pxlpainter::Admin.controllers :documents do
  get :index do
    @title = "Documents"
    @documents = Document.all
    render 'documents/index'
  end

  get :new do
    @title = pat(:new_title, :model => 'document')
    @document = Document.new
    render 'documents/new'
  end

  post :create do
    @document = Document.new(params[:document])
    if @document.save
      @title = pat(:create_title, :model => "document #{@document.id}")
      flash[:success] = pat(:create_success, :model => 'Document')
      params[:save_and_continue] ? redirect(url(:documents, :index)) : redirect(url(:documents, :edit, :id => @document.id))
    else
      @title = pat(:create_title, :model => 'document')
      flash.now[:error] = pat(:create_error, :model => 'document')
      render 'documents/new'
    end
  end

  get :edit, :with => :id do
    @title = pat(:edit_title, :model => "document #{params[:id]}")
    @document = Document.find(params[:id])
    if @document
      render 'documents/edit'
    else
      flash[:warning] = pat(:create_error, :model => 'document', :id => "#{params[:id]}")
      halt 404
    end
  end

  put :update, :with => :id do
    @title = pat(:update_title, :model => "document #{params[:id]}")
    @document = Document.find(params[:id])
    if @document
      if @document.update_attributes(params[:document])
        flash[:success] = pat(:update_success, :model => 'Document', :id =>  "#{params[:id]}")
        params[:save_and_continue] ?
          redirect(url(:documents, :index)) :
          redirect(url(:documents, :edit, :id => @document.id))
      else
        flash.now[:error] = pat(:update_error, :model => 'document')
        render 'documents/edit'
      end
    else
      flash[:warning] = pat(:update_warning, :model => 'document', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy, :with => :id do
    @title = "Documents"
    document = Document.find(params[:id])
    if document
      if document.destroy
        flash[:success] = pat(:delete_success, :model => 'Document', :id => "#{params[:id]}")
      else
        flash[:error] = pat(:delete_error, :model => 'document')
      end
      redirect url(:documents, :index)
    else
      flash[:warning] = pat(:delete_warning, :model => 'document', :id => "#{params[:id]}")
      halt 404
    end
  end

  delete :destroy_many do
    @title = "Documents"
    unless params[:document_ids]
      flash[:error] = pat(:destroy_many_error, :model => 'document')
      redirect(url(:documents, :index))
    end
    ids = params[:document_ids].split(',').map(&:strip)
    documents = Document.find(ids)
    
    if Document.destroy documents
    
      flash[:success] = pat(:destroy_many_success, :model => 'Documents', :ids => "#{ids.to_sentence}")
    end
    redirect url(:documents, :index)
  end
end
