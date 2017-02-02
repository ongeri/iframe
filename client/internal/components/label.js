var label = function(options){

    this.element = document.createElement('label');

    this.element.setAttribute("for", options.name);

    this.element.innerHTML = options.label;
    console.log("what i passed "+options.name+" "+options.label);
};

module.exports = label;