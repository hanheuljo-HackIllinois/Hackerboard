function ext_to_file(type) {
	if (type == "html" || type == "htm") return "HTML";
	if (type == "css" || type == "less" || type == "scss") return "CSS";
	if (type == "py" || type == "pyc" || type == "pyd" || type == "pyo" || type == "pyw" || type == "pyz") return "Python";
	if (type == "rb" || type == "ryb" || type == "erb" || type == "Gemfile") return "Ruby";
	if (type == "js" || type == "jshintrc" || type == "npmignore") return "JavaScript";
	if (type == "c" || type == "h") return "C";
	if (type == "cc" || type == "cpp" || type == "cxx" || type == "C" || type == "c++" || type == "h" || type == "hh" || type == "hpp" || type == "hxx" || type == "h++") return "C++";
	if (type == "m" || type == "mm") return "Objective-C";
	if (type == "cs") return "C#";
	if (type == "java" || type == "jar" || type == "class" || type == "jsp" || type == "do" || type == "jad" || type == "ser") return "Java";
	if (type == "f" || type == "for" || type == "f90" || type == "f95") return "Fortran";
	if (type == "sql") return "SQL";
	if (type == "php" || type == "phtml" || type == "php3" || type == "php4" || type == "php5" || type == "phps") return "PHP";
	if (type == "vb") return "Visual Basic .NET";
	if (type == "pl" || type == "pm" || type == "t" || type == "pod" || type == "prl") return "Perl";
	if (type == "s" || type == "S" || type == "asm" || type == "s79" || type == "s82" || type == "s90") return "Assembly";
	if (type == "swift") return "Swift";
	if (type == "xml") return "XML";
	if (type == "txt") return "Text";
	if (type == "json" || type == "eslintrc") return "JSON";
	if (type == "pdf" || type == "PDF") return "Docs";

	if (type == "png" || type == "jpg" || type == "gif" || type == "zip" || type == "gzip" || type == "map") return "Media";

// ADD MORE

	return "Other";
}