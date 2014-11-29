Pxlpainter::App.controllers :ajax do

    get :is_logged_in do
    	# Set JSON content type header
    	get_content_type_header

    	# Generate JSON response
    	generate_response !logged_in?, (strip_account_model(current_account) || 'No account logged in')
    end

    post :login do 
    	# Set JSON content type header
    	get_content_type_header

    	# Authenticates account if login credentials are provided
	    if account = Account.authenticate(params[:email], params[:password])
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
    	generate_response logged_in?, 'Logged out'
	end

end