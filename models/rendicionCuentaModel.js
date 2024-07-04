const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define el esquema para cada ítem de descripción de comprobante
const DescripcionComprobanteSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',  // Referencia al modelo de Producto
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    precioUnitario: {
        type: Number,
        required: true
    },
    unidadMedida: {
        type: Schema.Types.ObjectId,
        ref: 'UnidadMedida',  // Referencia al modelo de UnidadMedida
        required: true
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio',  // Referencia al modelo de Servicio
        required: true
    },
    tipoGasto: {
        type: Schema.Types.ObjectId,
        ref: 'TipoGasto',  // Referencia al modelo de TipoGasto
        required: true
    },
    moneda: {
        type: String,
        required: true
    },
    tipoCambio: {
        type: Number,
        validate: {
            validator: function (value) {
                // El tipo de cambio es requerido si la moneda es Dólares
                if (this.moneda === 'Dólares') {
                    return value != null && value > 0;
                }
                return true;
            },
            message: 'El tipo de cambio es obligatorio y debe ser mayor que 0 cuando la moneda es Dólares'
        }
    },
    subtotal: {
        type: Number,
        required: true
    }
});

// Define el esquema principal de RendicionCuenta
const RendicionCuentaSchema = new Schema({
    fecha: {
        type: Date,
        required: true
    },
    tipoComprobante: {
        type: String,
        required: true
    },
    nroComprobante: {
        type: String,
        required: true,
        unique: true
    },
    foto: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    estado: {
        type: Boolean,
        default: true
    },
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',  // Referencia al modelo de Proveedor
        required: true
    },
    descripcionComprobante: [DescripcionComprobanteSchema],  // Array de subdocumentos
    moneda: {
        type: String,
        required: true
    },
    tipoCambio: {
        type: Number,
        validate: {
            validator: function (value) {
                // El tipo de cambio es requerido si la moneda es Dólares
                if (this.moneda === 'Dólares') {
                    return value != null && value > 0;
                }
                return true;
            },
            message: 'El tipo de cambio es obligatorio y debe ser mayor que 0 cuando la moneda es Dólares'
        }
    },
    totalRendicion: {
        type: Number,
        required: true
    },
    registradoPor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('RendicionCuenta', RendicionCuentaSchema);
