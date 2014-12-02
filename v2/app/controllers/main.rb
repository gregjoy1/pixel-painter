Pxlpainter::App.controllers do
    get :index do
        # Set XSRF cookie for angular
        set_angular_xsrf_cookie

        erb :index
    end
end