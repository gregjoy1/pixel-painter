Pxlpainter::App.controllers :ajax do

    # - A C C O U N T   M A N A G E M E N T   R O U T E S - #

    get :is_logged_in do
        # Set JSON content type header
        get_content_type_header
        # Generate JSON response
        generate_response !logged_in?, (strip_account_model(current_account) || 'No account logged in')
    end

    get :login do 
        # Set JSON content type header
        get_content_type_header

        # Authenticates account if login credentials are provided
        if account = Account.authenticate('test@test.com', 'password')
            set_current_account(account)
        end

        # Generate JSON response
        generate_response !logged_in?, (strip_account_model(current_account) || 'Incorrect account credentials')
    end

    post :login do 
        # Set JSON content type header
        get_content_type_header


        json_params = get_json_request

        # Authenticates account if login credentials are provided
        if account = Account.authenticate(json_params['email'], json_params['password'])  
            set_current_account(account)
        end

        # Generate JSON response
        generate_response !logged_in?, (strip_account_model(current_account) || 'Incorrect account credentials')
    end

    get :logout do 
        # Set JSON content type header
        get_content_type_header

        # Removes account from session
        set_current_account(nil)

        # Generate JSON response
        generate_response logged_in?, 'Logged out'    end

    # - D O C U M E N T   M A N A G E M E N T   R O U T E S - #

    get :get_saved_documents do
        # Set JSON content type header
        get_content_type_header
        if logged_in?
            documents = Document.where(:account_id => get_current_account_id).order(:updated_at => :asc)
            documents = strip_document_model_array documents
            return generate_response false, documents
        end

        generate_response true, 'No account logged in'
    end

    post :create_document do
        # Set JSON content type header
        get_content_type_header

        json_params = get_json_request
        if logged_in?
            account_id = current_account.id
            if document = create_and_validate_document(json_params['name'], json_params['json'], account_id)
                return generate_response false, document
            end
            return generate_response true, 'Invalid document data'
        end

        generate_response true, 'No account logged in'
    end
    post :update_document do
        # Set JSON content type header
        get_content_type_header

        json_params = get_json_request
        if logged_in?
           account_id = current_account.id
            if document = edit_and_validate_document(json_params['document_id'], json_params['name'], json_params['json'], account_id)
                return generate_response false, document
            end
            return generate_response true, 'Invalid document data'
        end

        generate_response true, 'No account logged in'
    end

end