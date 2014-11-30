module Pxlpainter

	class App

		module AccountHelper

			# Function for removing potentially sensive
			# account information (hashes etc)
			def strip_account_model account
				if account
					return {
						:name => account[:name],
						:surname => account[:surname],
						:email => account[:email]
					}
				end
				nil
			end

			def get_current_account_id
				if logged_in?
					return current_account[:id]
				end
				nil
			end

		end

		helpers AccountHelper

	end

end