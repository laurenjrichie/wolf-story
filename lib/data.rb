require 'csv'

class DataParser

  attr_accessor :target_data, :get_data_coord

  def initialize(target_data)
    @target_data = get_data(target_data)
  end

  def get_data(region_name)
    files = Dir.glob("data/population_data.csv")
    raw_lines = ''

    files.each do |file|
      raw_lines = IO.readlines(file)
    end

    raw_lines.each do |line|
      line.delete!("\n")
    end

    array_of_rows = raw_lines.each_slice(1).to_a
    array_of_split_rows = []
    array_of_rows.each do |row|
      array_of_split_rows << row[0].split(',')
    end

    array_of_split_rows.each do |row|
      if row.include?(region_name)
        return row[1..-1]
      end
    end

  end

  def get_data_coord(region_coordinates)
    files = Dir.glob("data/#{region_coordinates}")
    raw_lines = ''

    files.each do |file|
      raw_lines = IO.readlines(file)
    end

    raw_lines.each do |line|
      line.delete!("\n")
    end

    raw_lines

  end

end

class Region
  attr_accessor :population_data, :circle_count, :coordinate_count, :headers, :generate_years_arrays, :generate_radius_arrays, :add_coordinates

  def initialize(region)
    @name = region
    @population_data = DataParser.new(region)
    @headers = DataParser.new("name").target_data
    @circle_counts = []
  end

  def circle_count
    @population_data.target_data.each do |year|
      _year = year.to_i
      if _year > 0 && _year < 10
        @circle_counts << 1
      elsif _year >= 10 && _year < 20
        @circle_counts << 2
      else
        @circle_counts << _year / 20
      end
    end
    @circle_counts
  end

  def coordinate_count
    circle_count.max
  end

  def generate_years_arrays
    years_array = []
    @headers.each do |year|
      years_array << [year]
    end
    years_array
  end

  def generate_radius_arrays
    radius_arrays = generate_years_arrays

    return radius_arrays.each_with_index do |array, index|
      if circle_count[index] < 4
        circle_count[index].times do
          array << rand(4..8)
        end
      else
        circle_count[index].times do
          array << rand(2..14)
        end
      end
      ((coordinate_count + 1) - array.length).times do
        array << 0
      end
    end

  end

  def transpose_radius_arrays
    generate_radius_arrays.transpose
  end

  def add_coordinates
    coord_data = DataParser.new(@name).get_data_coord("#{@name}.csv")
    return transpose_radius_arrays.each_with_index do |array, index|
      coordinates = coord_data[index]
      array.insert(0, coordinates.split(',')[1].to_f)
      array.insert(0, coordinates.to_f)
      array.insert(0, @name)
    end
  end

  def generate_csv # this code as is requires deleting three extra lines (headers) from output.
    data_to_export = add_coordinates
    data_to_export[0][0] = "name"
    data_to_export[0][1] = "xcoord"
    data_to_export[0][2] = "ycoord"

    CSV.open("data/output.csv", "ab") do |csv|
      data_to_export.each do |array|
        csv << array
      end
    end
  end

end

Region.new("nRockies").generate_csv
Region.new("gLakes").generate_csv
Region.new("southwest").generate_csv
Region.new("pacNW").generate_csv
