var idGlobal;

exports.getAll = function( req, res ) {
    res.send( 'Listar todos los appservers' );
};

exports.create = function( name, res ){

    res.send('name: '+ name + ' ,token: ');
};
