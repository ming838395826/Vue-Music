// https://eslint.org/docs/user-guide/configuring

module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint'
	},
	env: {
		browser: true,
	},
	extends: [
		// https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
		// consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
		'plugin:vue/essential',
		// https://github.com/standard/standard/blob/master/docs/RULES-en.md
		'standard'
	],
	// required to lint *.vue files
	plugins: [
		'vue'
	],
	// add your custom rules here
	rules: {
		//"off"或者0    //关闭规则关闭
		// "warn"或者1    //在打开的规则作为警告（不影响退出代码）
		// "error"或者2    //把规则作为一个错误（退出代码触发时为1）
		// allow async-await
		'generator-star-spacing': 'off',
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		//箭头函数用小括号括起来
		'arrow - parens ': 0,
		//文件以单一的换行符结束
		'eol-last': 0,
		//函数定义时括号前面要不要有空格
		'space-before-function-paren': 0
	}
}
