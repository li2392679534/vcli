<template>
  <div>
    <p>乘船人信息</p>
    <div class="person">
      <p class="ofen">
        <span class="ofen-user">常用乘船人</span
        ><input type="checkbox" name="" id="" />王小川<input
          type="checkbox"
          name=""
          id=""
        />张三<input type="checkbox" name="" id="" />李四<input
          type="checkbox"
          name=""
          id=""
        />王五<input type="checkbox" name="" id="" />田七
        <input type="checkbox" name="" id="" />兆家<a href="#"
          >收回&lt;&lt;&lt;</a
        >
      </p>
      <table>
        <tr>
          <td>
            <select name="" id="">
              <option value="">普通 &yen; 325</option>
              <option value="">学生 &yen; 299</option>
              <option value="">军人 &yen; 275</option>
              <option value="">儿童 &yen; 98</option>
            </select>
          </td>
          <td>姓名:<input type="text" /></td>
          <td>
            <select name="" id="">
              <option value="">身份证</option>
              <option value="">港澳通行证</option>
              <option value="">其他证件</option></select
            ><input type="text" />
          </td>
          <td>电话：<input type="text" /></td>
          <td><button>删除当前</button></td>
        </tr>
        <tr>
          <td>
            <select name="" id="">
              <option value="">普通 &yen; 325</option>
              <option value="">学生 &yen; 299</option>
              <option value="">军人 &yen; 275</option>
              <option value="">儿童 &yen; 98</option>
            </select>
          </td>
          <td>姓名:<input type="text" /></td>
          <td>
            <select name="" id="">
              <option value="">身份证</option>
              <option value="">港澳通行证</option>
              <option value="">其他证件</option></select
            ><input type="text" />
          </td>
          <td>电话：<input type="text" /></td>
          <td><button>删除当前</button></td>
        </tr>
        <tr>
          <td>
            <select name="" id="">
              <option value="">普通 &yen; 325</option>
              <option value="">学生 &yen; 299</option>
              <option value="">军人 &yen; 275</option>
              <option value="">儿童 &yen; 98</option>
            </select>
          </td>
          <td>姓名:<input type="text" /></td>
          <td>
            <select name="" id="">
              <option value="">身份证</option>
              <option value="">港澳通行证</option>
              <option value="">其他证件</option></select
            ><input type="text" />
          </td>
          <td>电话：<input type="text" /></td>
          <td><button>删除当前</button></td>
        </tr>
        <tr>
          <td>
            <select name="" id="">
              <option value="">普通 &yen; 325</option>
              <option value="">学生 &yen; 299</option>
              <option value="">军人 &yen; 275</option>
              <option value="">儿童 &yen; 98</option>
            </select>
          </td>
          <td>姓名:<input type="text" /></td>
          <td>
            <select name="" id="">
              <option value="">身份证</option>
              <option value="">港澳通行证</option>
              <option value="">其他证件</option></select
            ><input type="text" />
          </td>
          <td>电话：<input type="text" /></td>
          <td><button>删除当前</button></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.person {
  border: 1px solid skyblue;
}

.person .ofen {
  border-color: #ccc;
  height: 50px;
  line-height: 50px;
  background-color: #eee;
  width: 1100px;
  margin: 20px auto 0px;
  padding-left: 20px;
}

.ofen-user {
  margin-right: 25px;
}

.ofen input {
  margin-left: 15px;
}

.ofen a {
  text-decoration: none;
  margin-left: 100px;
  color: rgb(33, 165, 218);
}

.person table {
  border-collapse: collapse;
  width: 1100px;
  margin: 0 auto;
}

.person tr td {
  border-bottom: 1px solid #ccc;
}

.person table td {
  padding: 10px 0;
}
</style>
