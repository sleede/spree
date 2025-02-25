require 'swagger_helper'

describe 'Option Values API', swagger: true do
  include_context 'Platform API v2'

  resource_name = 'Option Value'
  include_example = 'option_type'
  filter_example = 'option_type_id_eq=1&name_cont=M'

  let(:id) { create(:option_value).id }
  let(:option_type) { create(:option_value) }
  let(:records_list) { create_list(:option_value, 2) }
  let(:valid_create_param_value) { build(:option_value).attributes }
  let(:valid_update_param_value) do
    {
      name: 'M'
    }
  end
  let(:invalid_param_value) do
    {
      name: '',
    }
  end

  include_examples 'CRUD examples', resource_name, include_example, filter_example
end
