/* global variantTemplate */
// variant autocompletion
$(function() {
  var variantAutocompleteTemplate = $('#variant_autocomplete_template')
  if (variantAutocompleteTemplate.length > 0) {
    window.variantTemplate = Handlebars.compile(variantAutocompleteTemplate.text())
    window.variantStockTemplate = Handlebars.compile($('#variant_autocomplete_stock_template').text())
    window.variantLineItemTemplate = Handlebars.compile($('#variant_line_items_autocomplete_stock_template').text())
  }
})

function formatVariantResult(results) {
  if (results.loading) {
    return results
  }

  if (results.type === 'variant') {
    var options = results.attributes.options_text.split(',')

    return $(variantTemplate({
      options: options,
      variant: results.attributes
    }))
  }
}
$.fn.variantAutocomplete = function() {
  // deal with initSelection
  return this.select2({
    placeholder: Spree.translations.variant_placeholder,
    minimumInputLength: 3,
    ajax: {
      url: Spree.routes.products_api_v2 + '?include=default_variant%2Cvariants%2Cimages',
      headers: Spree.apiV2Authentication(),
      dataType: 'json',
      data: function(params) {
        var query = {
          filter: {
            name_i_cont: params.term
          }
        }

        return query;
      },
      processResults: function(json) {
        var variantsAndImages = json.included
        variantsAndImages.forEach(item => findImages(item))

        function findImages (item) {
          if (item.type === 'variant' && item.relationships.images.data[0]) {
            var attachedImageId = item.relationships.images.data[0].id

            var path = setImgPath(attachedImageId)
            item.attributes.image_path = path
          }
        }

        function setImgPath (attachedImageId) {
          var imgPath = []
          var items = json.included

          items.forEach(function (i) {
            if (i.type === 'image' && i.id === attachedImageId) {
              imgPath.push(i.attributes.styles[2].url)
            }
          })
          return imgPath[0]
        }

        return {
          results: json.included
        }
      }
    },
    templateResult: formatVariantResult,
    templateSelection: function(variant) {
      if (variant.attributes) {
        if (variant.attributes.options_text) {
          return variant.attributes.name + ' (' + variant.attributes.options_text + ')'
        } else {
          return variant.attributes.name
        }
      }
    }
  })
}
